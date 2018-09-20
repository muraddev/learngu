import React from 'react';
import { getCookie } from './functions';
import Modal from "./Modal";
// import { XmlEntities } from 'html-entities'
import App from './App';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedword: "",
            sentence: props.sentence,
        }
        // this.setState({ sentence: })
        this.selectWord = this.selectWord.bind(this)
        this.abort = this.abort.bind(this)
    }

    // componentDidMount() {
    //     let entities = XmlEntities

    //     fetch(
    //         "/quote/"
    //     ).then(
    //         resp => resp.text().then(json => {
    //             console.log(json)
    //             this.setState({ sentence: entities.decode(JSON.parse(json)[0].content) })
    //         })
    //     )
    // }

    abort() {
        this.setState({ selectedword: ""})
    }

    selectWord(word) {
        this.setState({ selectedword: word })
    }

    render() {
        return (
            <div>
                <Modal data={{
                    selectedword: this.state.selectedword
                }} abort={this.abort} play={this.play} />
                <App slct={this.selectWord} sentence={this.state.sentence}></App>
            </div>

        )
    }
}

export default Main