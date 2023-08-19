import React, { useState } from 'react'
import { Button, Container, Form ,Spinner} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_KEY
})
const Params = {
  temperature: 0.5,
  max_tokens: 256,
}
const App = () => {
  const [response, setResponse] = useState('')
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSentData = async (e) => {
    e.preventDefault()
    console.log('form is submitted');
    setLoading(true)
    const prompt = userInput
    try {
      const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions"
      const body = { ...Params, prompt }
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configuration.apiKey}`
        },
        body: JSON.stringify(body)
      })
  
      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data);
      setResponse(data.choices[0].text)
      setLoading(false)
    } catch (error) {
      console.log('error occured',error);
      alert(error.message)
    }

  }

  return (
     <Container className='mt-3'>
    <h3 className='mt-3 text-primary'>Chat with me</h3>
      <Form onSubmit={handleSentData}>
        <Form.Control type='text' value={userInput} onChange={e => setUserInput(e.target.value)} />
        <Button variant='info' type='submit' className='mt-3' disabled={!userInput}>Submit</Button>
      </Form>
      <div className='mt-3'>
        {loading?<Spinner/>: response? response:'no questions asked'}
      </div>
    </Container>
  )
}

export default App