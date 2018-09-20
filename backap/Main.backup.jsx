import React from 'react';
import { getCookie } from './functions';
import Modal from "./Modal";
import { XmlEntities } from 'html-entities'
import App from './App';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedword: "",
            translations: [],
            audio: "",
            sentence: "",
            wordId:""
        }
        this.selectWord = this.selectWord.bind(this)
        this.abort = this.abort.bind(this)
        this.play = this.play.bind(this)
    }

    componentDidMount() {
        let entities = XmlEntities

        fetch(
            "/quote"
        ).then(
            resp => resp.json().then(json => {
                console.log(json)
                this.setState({ sentence: entities.decode(json[0].content) })
            })
        )
    }
    abort() {
        this.setState({ selectedword: "", translations: [], audio: "" })
        if (this.controller != null) {
            this.controller.abort()
        }
    }

    selectWord(word) {

        this.setState({ selectedword: word, translations: [], audio: "" })

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
                    this.setState({ translations: json.translations, audio: json.audio,wordId:json.id });
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
        return (
            <div>
                <Modal data={{
                    selectedword: this.state.selectedword,
                    translations: this.state.translations,
                    audio:this.state.audio,
                    id:this.state.wordId
                }} abort={this.abort} play={this.play} />
                <App slct={this.selectWord} sentence={this.state.sentence}></App>
            </div>

        )
    }
}

export default Main