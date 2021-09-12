import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './App.css';


function App() {
  const [msg, setMsg] = useState('');

  const onMessageClick = () => {
    console.log(msg);
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col className={'left-container'} md={8}>
            <h1>{'Wave At Me! 👋🏻'}</h1>
            <h3>{'Hi! My name is Aahad, and this is my wave portal. Write down a cool note and send me some luv across the Blockchain :D'}
            </h3>
            <textarea
              rows={3}
              style={{
                resize: 'none'
              }}
              onChange={(event) => {
                setMsg(event.target.value)
              }}
              type="text"
              className="form-control"
              id="formGroupExampleInput"
            />
            {console.log(msg.trim() === '')}
            <Button
              disabled={msg.trim() === ''}
              onClick={onMessageClick}
              className={'send-button'}>
              {'Hit me!!'}
            </Button>
            <div className={'wave-counter'}>
              <h5>
                {'People waved at you'}
              </h5>
              <h2>
                {'0'}
              </h2>
            </div>
          </Col>
          <Col
            className={'right-container'}
            md={4}>{'No Waves 😿'}</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
