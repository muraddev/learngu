import React from 'react'
import ChooseGame from './ChooseGame'
import { Segment, Grid, Dimmer, Header, Icon, Loader, GridColumn } from 'semantic-ui-react';
import { getCookie } from '../functions';
import { Result } from '../Classes';
import { Redirect } from 'react-router-dom'


class Word extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currrent: 0,
            words: [],
            finished: false,
            trainings: false,
            training: "word"
        }
        this.checkedData = []
        this.checked = this.checked.bind(this);
        this.goNext = this.goNext.bind(this);
        this.goTotraining = this.goTotraining.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        this.getData("word");
    }

    goNext() {
        this.setState({
            currrent: this.state.currrent + 1

        })
        if (this.checkedData.length == this.state.words.length) {
            this.finish()
        }
    }

    getData(training) {
        fetch("/api/userword?training=" + training, {
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
                console.log(json)
                if(json.response.length==0)
                    this.setState({trainings:true})
                let words = json.response
                if (this.state.training == "word" || this.state.training == "translation") {
                    let choices = json.choises.map((a) => {
                        return { word: a, times: 0 };
                    })
                    // console.log
                    words = this.createVariants(json.response, choices)
                }


                this.setState({
                    words
                })
            }
        )
    }

    createVariants(words, choices) {
        return words.map(word => {
            let variants = []
            while (variants.length != 3) {
                choices = choices.sort((a, b) => {
                    return a.times - b.times
                })
                let x = true
                let i = 0;
                while (x) {
                    let choice = choices[i]
                    const checkable = (this.state.training == "word" ? word.translation : word.word)

                    if (choice.word != checkable && variants.indexOf(choice.word) == -1) {
                        variants.push(choice.word);
                        choice.times++;
                        x = false;
                    }
                    i++;

                }

            }
            return { ...word, variants }
        })
    }

    checked(data) {
        data = this.state.training == "word" ? { ...data, word_translation: data.found } :
            this.state.training == "translation" ? { ...data, translation_word: data.found } :
                this.state.training == "audio" ? { ...data, audio: data.found } :
                    { ...data, keyboard: data.found }
        
        this.checkedData = [...this.checkedData, data]
        console.log(data)
        
        let audio = new Audio(data.audio_clip);
        audio.play();
        // let audio = Audio(this.)
    }

    restart() {
        console.log("restart")
        this.data = []
        this.setState({
            currrent: 0,
            words: [],
            finished: false
        })

        this.checkedData = []

        this.getData(this.state.training)
    }

    goTotraining() {
        this.setState({ trainings: true })
    }

    finish() {
        const condition = this.state.training == "word";
        console.log(this.checkedData)
        this.setState({
            finished: true
        })

        this.data = this.checkedData.filter
            (word => this.state.training == "word" ? word.word_translation :
                this.state.training == "translation" ? word.translation_word :
                    this.state.training == "audio" ? word.audio :
                        word.keyboard
            )

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


    render() {
        if (this.state.trainings)
            return <Redirect to="/training" />

        return (
            <div>
                <Dimmer active={this.state.words.length == 0} page>
                    <Loader>Loading</Loader>
                </Dimmer>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column computer={8} tablet={12} mobile={16}>
                            <Segment color="purple">
                                <div>
                                    {
                                        this.state.words.map((d, i) => {
                                            if (i == this.state.currrent)
                                                return <ChooseGame checked={this.checked} question={d} key={i} next={this.goNext} game={this.state.training} />
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
                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            // <div className="contain">

            // </div>
        )
    }

}

export default Word;