import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import './App.css';
import abi from './utils/WavePortal.json';
import loading from './assets/loading.gif';

const alertDefaultData = {
  show: false,
  text: 'Dummy',
  variant: 'success'
}

function App() {
  const { ethereum } = window;
  const [msgArray, setMsgArray] = useState();
  const [currentAcc, setCurrentAcc] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const msgRef = useRef();
  const ratingRef = useRef();
  const contractAddress = "0x79e614A6128Af31Cc1494Cd52719d624194e73F1";
  const contractABI = abi.abi;
  const [alertData, setAlertData] = useState(alertDefaultData);
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  const checkWalletIfConnected = () => {
    if (!ethereum) {
      setAlertData({
        show: true,
        text: 'Make sure you have metamask!!!!',
        variant: 'warning'
      })
      return
    }
    //  else {
    //   console.log('We Have Eth Obj!', ethereum);
    // }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an account!', account);
          setCurrentAcc(account);
          getTotalLove();
        } else {
          setAlertData({
            show: true,
            text: 'No acc on Metamask found!',
            variant: 'warning'
          })
        }
      })
  };

  const connectWallet = () => {
    if (!ethereum) {
      setAlertData({
        show: true,
        text: 'Get Metamask!',
        variant: 'warning'
      })
      setLoadingState(false);
      return;
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setAlertData({
          show: true,
          text: `Connected with ${accounts[0]}`,
          variant: 'warning'
        })
        setLoadingState(false);
        setCurrentAcc(accounts[0])
      })
      .catch(err => console.log(err))
  }

  const sendLove = async (message, rating) => {
    setLoadingState(true);
    let LoveArray = await wavePortalContract._getLoveArray();


    const waveTxn = await wavePortalContract._showLove(message, rating, { gasLimit: 300000 });
    console.log("Mining...", waveTxn.hash);
    await waveTxn.wait();
    console.log("Mined!...", waveTxn.hash);
    LoveArray = await wavePortalContract._getLoveArray();
    setMsgArray(LoveArray);
    setLoadingState(false);
    msgRef.current.value = '';
    ratingRef.current.value = 1;
  }

  const getTotalLove = async () => {
    let LoveArray = await wavePortalContract._getLoveArray();
    setMsgArray(LoveArray);
    setLoadingState(false);
    // LoveArray.forEach(o => {
    //   console.log(o['message']);
    //   console.log(o['rating'])
    // })
  }

  useEffect(() => {
    checkWalletIfConnected();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (alertData.show) {
      setTimeout(() => {
        setAlertData({ text: alertData.text, ...alertDefaultData });
      }, 2000);
    }
    // eslint-disable-next-line
  }, [alertData.show]);

  const onMessageClick = () => {
    if (currentAcc === "") {
      return;
    }
    if (msgRef.current.value.trim() === '') {
      setAlertData({
        show: true,
        text: 'Please type a message',
        variant: 'warning'
      });
      return;
    } else if (ratingRef.current.value === '0') {
      return;
    }
    // setMsgArray(tempMsg);
    sendLove(msgRef.current.value, ratingRef.current.value);
    // console.log(tempMsg);
  }

  const calcDate = date => {
    return Date(date);
  }

  return (
    <div className="App">
      <Alert show={alertData.show} variant={alertData.variant}>
        {alertData.text}
      </Alert>
      <Container>
        <Row>
          <Col className={'left-container'} md={8}>
            <h1>{'Wave At Me! 👋🏻'}</h1>
            <h3>{'Hi! My name is Aahad, and this is my wave portal. Write down a cool note and send me some luv across the Blockchain :D'}
            </h3>
            <div
              onClick={connectWallet}
              style={currentAcc === ""
                ? {
                  cursor: 'pointer'
                }
                : {}}
              className={'account-details'}>
              <span>{currentAcc === ""
                ? 'No Account Connected, Click here! 😢'
                : 'Metamask Connected 😁'}
              </span>
            </div>
            <span>{'Message'}</span>
            <textarea
              onChange={event => {
                if (event.target.value.trim() === "") {
                  setDisabled(true);
                } else {
                  setDisabled(false);
                }
              }}
              rows={3}
              style={{
                resize: 'none'
              }}
              required
              ref={msgRef}
              placeholder="Enter your message with your name!"
              type="text"
              className="form-control"
              id="formGroupExampleInput"
            />
            <span>{'Rating'}</span>
            <input
              defaultValue={1}
              max={5}
              min={1}
              required
              ref={ratingRef}
              type="number"
              className="form-control rating"
            />
            <Button
              disabled={loadingState || currentAcc === "" || disabled}
              onClick={onMessageClick}
              className={'send-button'}>
              {'Hit me!!'}
            </Button>
            {loadingState
              ? <div>
                <img style={{
                  width: 80,
                  height: 80,
                }} alt='loading' src={loading} />
              </div>
              : null}
            {
              msgArray && !loading
                ? <div className={'wave-counter'}>
                  <h2>
                    {msgArray.length}
                  </h2>
                  <h5>
                    {'people love you!'}
                  </h5>
                </div>
                : null
            }
          </Col>
          <Col
            className={'right-container'}
            md={4}>
            {loadingState
              ? <div>
                <img style={{
                  width: 80,
                  height: 80,
                }} alt='loading' src={loading} />
              </div>
              : msgArray && msgArray < 1
                ? <h5>{'No Love Found 😿'}</h5>
                : msgArray && msgArray.map((o, index) => {
                  return (
                    <div key={`${o.message.substring(2)}-${index}`} className="card love-card" style={{
                      width: 'inherit',
                      marginBottom: 20,
                    }}>
                      <div className="card-body">
                        <h5 className="card-title">{'Rating: '}{o['rating']}</h5>
                        <h3 className="card-text">{
                          o['message']
                        }
                        </h3>
                        <p className="card-text">{'Address: '}{
                          o['sender']
                        }
                        </p>
                        <p className="card-text">{'Time: '}{
                          // moment(Date(o['timestamp'].toString())).toDate()
                          calcDate((o['timestamp'].toString()))
                        }
                        </p>
                      </div>
                    </div>
                  )
                })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
