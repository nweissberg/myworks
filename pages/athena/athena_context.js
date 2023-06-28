import React, { useContext, useEffect, useState } from "react"
import YAML from 'yaml'
import DevelopmentWrapper from "../../componets/wrapper_developer"
import CodeViewer from "../components/code_viewer"
import { normalize } from "../utils"

const AthenaContext = React.createContext()

export function useAthena(){
    return useContext(AthenaContext)
}

export function set_code_viewer(code){
    set_code(code);
}
export async function loadYaml(path) {
	return new Promise( async(resolve, reject) => {
        const response = await fetch(path);
        const data = YAML.parseAllDocuments(await response.text());
        resolve(data);
    })
}

export function yamlDocToJSON(yamlDoc) {
    return JSON.parse(JSON.stringify(yamlDoc));
} 

export default function AthenaProvider({children}) {
    const [brain_data, set_brain_data] = useState(null)
    const [assistant, set_assistant] = useState(null)
    const [language, set_language] = useState(null)
    const [code, set_code] = useState(null)

    function loadBrain(){
        loadYaml('/data/brain.yaml').then((data)=>{
            set_brain_data(yamlDocToJSON(data[0]))
            set_code(yamlDocToJSON(data[0]))
            set_assistant(yamlDocToJSON(data[0]).text.generate.role.assistant)
        })
    }

  	useEffect(()=>{
        var userLang = navigator.language || navigator.userLanguage; 
        set_language(userLang.toLowerCase())
        loadBrain()
        return(()=>console.log("AthenaProvider unmounted"))
  	},[])

    function setLanguage(lang){
        console.log('setting language to '+lang)
        set_language(lang.toLowerCase())
    }

    const value = {
        setLanguage,
        loadBrain,
        set_code,
        brain_data,
        assistant,
        language,
    }

    return (
        <AthenaContext.Provider value={value}>
            {children}
            {brain_data && <DevelopmentWrapper>
                <CodeViewer
                    header={'Code Viewer'}
                    code={code}
                    reload={()=>{loadBrain()}}
                    language='json'
                    highlight=''
                />
            </DevelopmentWrapper>}
        </AthenaContext.Provider>
    )
}