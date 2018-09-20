import React from 'react'
import { Grid, Segment, Image } from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import { getCookie } from './functions';

class Trainings extends React.Component {
    constructor(props){
        super(props)
        this.state={
            training:null,
            amounts:{
                
            }
        }
    }
    
    componentDidMount(){
        fetch("/api/userword?amount=get", {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then((response) => response.json()).then(
            (json) => {
                console.log("amounts",json)
                this.setState({ amounts: json })
            }
        )
    }

    render() {
        if(this.state.training!=null){
            return <Redirect push to={this.state.training} />
        }
        return (
            <div>
                <Grid>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} tablet={8} computer={4} className="trainColumn">
                            <Segment textAlign="center" padded="very" color="purple" onClick={()=>this.setState({training:"/training/word"})}>
                                <Image src="https://heroku-learnguage.s3.amazonaws.com/static/w-t.png" size="small" centered />
                                {/* <br /> */}
                                <h3>
                                    Word-Translation
                                </h3>
                                {
                                    (this.state.amounts.word!=undefined)?
                                        <span style={{color: "#949494"}}>remains: {this.state.amounts.word}</span>:
                                        ""
                                }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4} className="trainColumn">
                            <Segment textAlign="center" padded="very" color="purple"  onClick={()=>this.setState({training:"/training/translation"})}>
                                <Image src="https://heroku-learnguage.s3.amazonaws.com/static/t-w.png" size="small" centered />
                                {/* <br /> */}
                                <h3>
                                    Translation-Word
                                </h3>
                                {
                                    (this.state.amounts.translation!=undefined)?
                                        <span style={{color: "#949494"}}>remains: {this.state.amounts.translation}</span>:
                                        ""
                                }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4} className="trainColumn">
                            <Segment textAlign="center" padded="very" color="purple" onClick={()=>this.setState({training:"/training/keyboard"})}>
                                <Image src="https://heroku-learnguage.s3.amazonaws.com/static/keyboard.png" size="small" centered />
                                {/* <br /> */}
                                <h3>
                                    Keyboard
                                </h3>
                                {
                                    (this.state.amounts.audio!=undefined)?
                                        <span style={{color: "#949494"}}>remains: {this.state.amounts.keyboard}</span>:
                                        ""
                                }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4} className="trainColumn">
                            <Segment textAlign="center" padded="very" color="purple"onClick={()=>this.setState({training:"/training/audio"})}>
                                <Image src="https://heroku-learnguage.s3.amazonaws.com/static/Audio.png" size="small" centered />
                                {/* <br /> */}
                                <h3>
                                    Audio
                                </h3>
                                {
                                    (this.state.amounts.audio!=undefined)?
                                        <span style={{color: "#949494"}}>remains: {this.state.amounts.audio}</span>:
                                        ""
                                }
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default Trainings