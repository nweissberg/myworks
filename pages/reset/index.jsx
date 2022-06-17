import React, { useRef, useState, useEffect } from "react"
import { ProgressBar } from 'primereact/progressbar';
import ObjectComponent from "../components/object"
import {Form, Card, Alert} from 'react-bootstrap'
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css"
import { useAuth } from "../api/auth"
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'

export default function Reset() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { resetPassword, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value).then((user)=>{
                // console.log(user)
                Swal.fire(
                    `Reset enviado para: ${emailRef.current.value}`,
                    '',
                    'success'
                )
            })
        }catch(error){
            console.log(error)
            setError("Reset de senha falhou")
        }
        setLoading(false)
    }
    useEffect(()=>{
        if(currentUser) router.push('/')
    }, [currentUser])

    if(currentUser !== null) return(<><ProgressBar mode="indeterminate" style={{ height: '6px' , marginBottom:"-6px" }}></ProgressBar></>)

	return (
		<ObjectComponent onLoad={(e)=>{
			document.title = "Login"
		}}>
            <div
                style={{
                    position:"absolute",
                    width:"100%",
                    height:"calc(100vh - 80px)",
                    // backgroundColor:"var(--surface-b)"
                }}
            >
                <Container
                    className='d-flex align-items-center justify-content-center'
                    style={{
                        minHeight:"100%"
                    }}
                >
                    <div className='w-100' style={{maxWidth:"400px"}}>
                    <Card style={{
                            backgroundColor:"rgba(33,35,40,0.5)",
                            backdropFilter: "blur(5px)"
                            }}>
                            <Card.Body>
                                <h2 style={{color:"var(--text)"}}  className="text-center mb-4">Reset de Senha</h2>
                                {/* {currentUser?.email} */}
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label style={{color:"var(--info)"}} className="m-2">Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required />
                                    </Form.Group>
                                    <Button
                                        style={{
                                            width:"100%",
                                            background:"var(--primary)",
                                            borderColor:"var(--primary-b)",
                                            color:"var(--text)"
                                        }}
                                        label="Enviar"
                                        disabled={loading}
                                        className="w-100 mt-4"
                                        type="submit"
                                    />
                                </Form>
                                <div className="w-100 text-center mt-2" style={{color:"var(--text)"}}>
                                    <Button label="Voltar para Log In" className="p-button-link" onClick={()=>{
                                        router.push('/login')
                                    }}/>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
		</ObjectComponent>
	)
}
