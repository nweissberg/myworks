
import React, { useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';

export default function ChatContextMenu(props) {
    const cm = useRef(null);
    const [bubble, set_bubble] = useState(null)
    
    function clickAction(mode){
        const index = bubble.split('_')
        const obj = props['chat_'+index[1]].find(c_bubble=>c_bubble.index == index[2])
        props.onAction(obj,mode)
    }

    const items = [
        {
            label: 'Reagir',
            icon: 'pi pi-fw pi-user',
            items:[
                {
                    label: 'Curti',
                    icon: 'pi pi-fw pi-thumbs-up',
                    command:()=>{
                        clickAction("Like")
                    }
                },
                {
                    label: 'Amei',
                    icon: 'pi pi-fw pi-heart',
                    command:()=>{
                        clickAction("Love")
                    }
                },
                {
                    label: 'Foi incrível',
                    icon: 'pi pi-fw pi-star',
                    command:()=>{
                        clickAction("Star")
                    }
                },
                {
                    label: 'Não Gostei',
                    icon: 'pi pi-fw pi-thumbs-down',
                    command:()=>{
                        clickAction("Dislike")
                    }
                },
            ]
        },
        {
            separator: true
        },
        {
            label: 'Ouvir',
            icon: 'pi pi-fw pi-volume-up',
            command:()=>{
                clickAction("Listen")
            }
        },
        {
            label: 'Salvar',
            icon: 'pi pi-fw pi-bookmark',
            command:()=>{
                clickAction("Save")
            }
        },
        {
            separator: true
        },
        {
            label: 'Deletar',
            icon: 'pi pi-fw pi-trash',
            command:()=>{
                clickAction("Delete")
            }
        }
    ];

    return (
        <>
            <ContextMenu model={items} ref={cm} />
            <div onContextMenu={(e) => {
                if(e.target.parentElement.id){
                    set_bubble(e.target.parentElement.id)
                    cm.current.show(e)
                }
            }}>
                {props.children}
            </div>
        </>
    );
}
