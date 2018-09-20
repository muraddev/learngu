import React, { Component } from 'react'
import { getCookie } from './functions';
import { Segment, Grid, GridRow, List, ModalContent } from 'semantic-ui-react';

export default class Modal extends Component {

    constructor(props) {

        super(props);
        this.state = {
            translations: [],
            audio: "",
            wordId: "",
            word: "",
            max: 5
        }
    }
    show() {
        return (
            <div id="exit" style={{ position: "fixed", width: "100%", height: "100%", top: 0, left: 0,
            //  backgroundColor: "rgba(0,0,0,.6)",
              display: "flex", alignItems: "center" }} onClick={(event) => {

                console.log(event.target.id, event.target.className == "row")
                if (event.target.id == "exit" || event.target.className == "row") {
                    this.setState({
                        translations: [],
                        audio: "",
                        wordId: "",
                        word: "",
                        max: 5
                    })
                    if (this.controller != null) {
                        this.controller.abort()
                    }
                    this.props.abort()
                }

            }}>
                <Grid style={{ width: "100%", margin:"0" }} centered>
                    <Grid.Row>
                        <Grid.Column mobile="14" tablet="8" computer="6">
                            <Segment id="content"
                                style={{ padding: "15px 7px 7px" }}
                            >
                                <span style={{ fontSize: 30 }}>{this.props.data.selectedword}</span> <i style={{ visibility: this.props.data.audio == "" ? "hidden" : "visible", cursor: "pointer" }} className="fas fa-volume-up" onClick={
                                    () => {
                                        this.play()
                                    }
                                }></i>
                                <div style={{ maxHeight: "calc(70vh)", overflow: "auto",marginTop:"10px" }}>
                                    <List selection animated verticalAlign='middle'>
                                        {
                                            this.state.translations.map((word, key) => {
                                                if (key >= this.state.max)
                                                    return;
                                                return (
                                                    <List.Item style={{ color: "black" }} key={key} onClick={() => this.setTranslation(this.state.wordId, word.text)}>
                                                        {word.text}
                                                    </List.Item>
                                                )
                                            })
                                        }
                                        {
                                            this.state.translations.length > this.state.max ?
                                                <List.Item onClick={() => this.setState({ max: this.state.max * 2 })}>
                                                    More translations
                                                </List.Item> : ""
                                        }
                                    </List>
                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div >
        )
    }

    setTranslation(word, translation) {
        console.log(word, translation)
        fetch("/api/userword", {
            method: "POST",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(
                {
                    word,
                    translation
                }
            )
        }).then(response => response.json()).then(
            json => {
                console.log(json)
                this.setState({
                    translations: [],
                    max: 5
                })
                // console.log(this.props.addToDictionary)
                if (this.props.addToDictionary != undefined)
                    this.props.addToDictionary(json.word)
                this.props.abort()
            }
        )
    }

    selectWord(word) {

        if (word == this.state.word)
            return;
        this.setState({word})



        const url = "/api/"

        const AbortController = window.AbortController

        let controller = this.controller = new AbortController()

        let signal = controller.signal


        fetch(url, {
            signal: signal,
            method: "POST",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(
                {
                    text: word,
                    language: "en_az"
                }
            )
        }).then(
            response => response.text().then(
                json => {
                    json = JSON.parse(json);
                    this.setState({ translations: json.translations, audio: json.audio, wordId: json.id, word });
                    this.play();
                }
            )
        )
    }


    play = () => {
        let audio = new Audio(this.state.audio);
        audio.play();
    }


    render() {
        if (this.props.data.selectedword != "") {
            this.selectWord(this.props.data.selectedword)
            return this.show()
        }
        else {
            if (this.state.word != "")
                this.setState({ word: "" })
        }
        return <span></span>
    }
}