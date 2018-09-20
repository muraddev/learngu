import React from 'react';
import data from "./data";
import WordByWord from './WordByWord'
import { Grid, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { getCookie } from '../functions';
import { Result } from '../Classes';
import {Redirect} from 'react-router-dom'

export default class Keyboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            words: [],
            currrent: 0,
            finished: false,
            trainings: false
        }

        this.checkedData = []
        this.checked = this.checked.bind(this)
        this.goNext = this.goNext.bind(this);
        this.goTotraining = this.goTotraining.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    goNext() {
        this.setState({
            currrent: this.state.currrent + 1
        })

        if (this.checkedData.length == this.state.words.length) {
            this.finish()
        }
    }

    getData() {
        fetch("/api/userword?training=keyboard", {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken")
            }
        }).then((response) => response.json()).then(
            (json) => {
                let words = json.response
                console.log(words)
                this.setState({
                    words
                })
            }
        )
    }

    finish() {
        console.log(this.checkedData)
        this.setState({
            finished: true
        })

        this.data = this.checkedData.filter(word => word.keyboard)

        fetch("/api/userword", {
            method: "PUT",
            body: JSON.stringify({ body: this.data }),
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then(response => response.json())
            .then(json => console.log("response", json))
            .catch(e => console.log(e))
    }

    checked(data) {
        this.checkedData = [...this.checkedData, { ...data, keyboard: data.found }]
        console.log(this.checkedData)
    }


    restart() {
        console.log("restart")
        this.data = []
        this.setState({
            currrent: 0,
            words: [],
            finished: false
        });
        
        this.checkedData=[];

        this.getData();
    }

    goTotraining() {
        this.setState({ trainings: true })
    }

    render() {
        
        if(this.state.trainings)
            return <Redirect to="/training" />

        return (<div>
            <Dimmer active={this.state.words.length == 0} page>
                <Loader>Loading</Loader>
            </Dimmer>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column computer={8}>
                        <Segment color="purple">
                            {
                                this.state.words.map((word, i) => {
                                    if (this.state.currrent == i)
                                        return <WordByWord checked={this.checked} question={word} word={word.word} next={this.goNext} translation={word.translation} index={i} key={i} />
                                })
                            }
                            {
                                this.state.finished ?
                                    <Result
                                        success={this.data.length}
                                        fail={this.state.words.length - this.data.length}
                                        restart={this.restart}
                                        goTotraining={this.goTotraining} />
                                    :
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