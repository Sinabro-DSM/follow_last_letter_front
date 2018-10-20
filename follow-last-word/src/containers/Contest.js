import React, { Component } from 'react';
import './Contest.css';
import ContestAlertMessage from 'components/Contest/ContestAlertMessage'
import RecordBtn from 'components/Contest/recordBtn'
import ContestWord from 'components/Contest/ContestWord'
import ContestHeader from 'components/Contest/ContestHeader'
import * as API from '../services/game.js'


export default class Contest extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      show: false,
      isListenNow: false,
      transcript: '',
      prevWord: '',
      language: 'ko-KR',
      errorMessage: '',
      isWordWrong: true,
      time: 15,
      point: 0,
      AIPoint: 0,
      userLife: 4,
      AILife: 2,
      maxtime: 15,
      tempTime: 0
    };
    this.gameStart()
  }

  componentDidMount() {
    document.addEventListener("keyup", this.onSpacebarPressed, false);
    
    const Recognition = window.webkitSpeechRecognition;
    if (!Recognition) {
      alert(
        'Speech Recognition API is not supported in this browser, try chrome'
      );
      return;
    }

    this.recognition = new Recognition();
    this.recognition.lang = this.state.language || 'ko-KR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = event => {
      const {transcript} = event.results[0][0];
      console.log('Result: ', transcript);
      this.setState({transcript});
      this.sendData(this.state.transcript);
    };

    this.recognition.onspeechend = () => {
      console.log('speech end');
      this.stop();
      this.setState({ show: true });
    };

    this.recognition.onnomatch = event => {
      console.log('no match');
      this.setState({ 
        transcript: "",
        errorMessage: '정확하게 다시 말해주세요'
      });
    };

    this.recognition.onstart = () => {
      console.log('speech start');
      this.setState({
        listening: true
      });
    };

    this.recognition.onend = () => {
      this.setState({
        listening: false,
      });
      if(this.state.transcript === "") {
        this.setState({
          errorMessage: '정확하게 다시 말해주세요'
        })
      }
      this.stop();
    };

    this.recognition.onerror = event => {
      console.log('error', event);
      this.setState({
        show: true,
        errorMessage: event.error,
      });
    };
  }

  onSpacebarPressed = (event) => {
    console.log('something pressed');
    let spaceKeyCode = 32
    if(event.keyCode === spaceKeyCode) {
      console.log('space pressed');
      this.toggleRecord();
    }
  }
  
  toggleRecord = () => {
    if(this.state.listening) {
      this.stop();
    }else {
      this.start();
    }
  }

  start = () => {
    console.log('start')
    this.interval = setInterval(this.countTime , 10);
    this.setState({
      errorMessage: "듣는 중"
    })
    console.log('start interval: ', this.interval);
    this.recognition.start();
  };

  stop = () => {
    console.log('stop');
    this.setState(prevState => {
      return {
        tempTime: prevState.time
      }
    })
    this.recognition.stop();
  };
  
  sendData = (transcript) => {
    API.postEasyWord(transcript)
    .then(response => {
      console.log(response.status);
      switch(response.status) {
        case 204:
          console.log('204 clear: ', this.interval);
          clearInterval(this.interval)
          this.setState(prevState => {
            let point = 5*this.state.tempTime;
            return {
              errorMessage: "AI가 알맞은 대답을 찾지 못했습니다!",
              time: prevState.maxtime - 0.5,
              maxtime: prevState.maxtime -0.5,
              AILife: prevState.AILife-1,
              point: prevState.point + point
            }
          });
          this.gameStart();
          if(this.state.AILife === 0) {
            alert("게임 승리!");
          }
          break;
        case 200:
          console.log('200 clear: ', this.interval);
          clearInterval(this.interval);
          let point = 5*this.state.tempTime;
          let AIPoint = 5*(this.maxtime-response.data[2]);
          this.setState(prevState => {
            return {
              errorMessage:'알맞은 응답입니다',
              prevWord: transcript,
              time: prevState.maxtime - 0.5,
              maxtime: prevState.maxtime -0.5,
              point: prevState.point + point,
              AIPoint: prevState.AIPoint + AIPoint
            }
          });

          this.setState({
            prevWord: response.data[1]
          })
          break;
        default:
          console.log("없는 단어입니다.");
          this.setState({
            errorMessage: "없는 단어입니다!"
          });
      }
    })
  }

  countTime = () => {
    console.log("count")
    if(this.state.time === 0) {
      console.log('time done: clear: ', this.interval);
      clearInterval(this.interval);
      this.setState(prevState => {
        return {
          userLife: prevState-1,
          errorMessage: '제한시간이 초과되었습니다.',
          time: prevState.maxtime - 0.5,
          maxtime: prevState.maxtime -0.5
        }
      });
    }else {
      this.setState(prevState => {
        return {
          time: Math.round((prevState.time-0.01)*100)/100
        };
      });
    }
  }

  gameStart = () => {
    console.log("game start!");
    API.getFirstEasyWord().then(response => {
      console.log(response);
      this.setState({
        prevWord: response.data,
        transcript: ''
      })
    });
  }

  countPoint() {
    
  }

  render() {
    return (
      <div className="contest">
        <ContestHeader />
        <ContestAlertMessage errorMessage={this.state.errorMessage} />
        
        <div id="words">
          <ContestWord isWrong={false} word={this.state.prevWord} />
          {/* {this.state.show ?  : ''} */}
          <ContestWord isWrong={this.state.isWordWrong} word={this.state.transcript}/>
          <span className="contest-word"></span>
        </div>
        <span>{this.state.time}</span>
        
        <RecordBtn toggleFunc={this.toggleRecord}/>
      </div>
    );
  }
}
