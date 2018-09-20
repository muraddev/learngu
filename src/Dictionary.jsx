import React from 'react'
import { getCookie } from './functions';
import { Table, Button, Progress, Form, Grid, Input, Icon, Modal, Sticky, Checkbox, Container, Visibility, Tab } from 'semantic-ui-react';
import WordModal from "./Modal"

export default class Dictionary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dictionary: [],
            selectedword: "",
            filter: "",
            open: false,
            filterProgress: this.all,
            checked: [],
            contextRef: null,
            stickyActive: false
        }
        this.selectedword = "";
        this.setTheWord = this.setTheWord.bind(this)
        this.abort = this.abort.bind(this)
        this.addToDictionary = this.addToDictionary.bind(this)
        this.getProgress = this.getProgress.bind(this)
    }

    addToDictionary(word) {
        const sameWord = this.state.dictionary.filter(dict => {
            return dict.id == word.id
        })
        if (sameWord.length > 0) {
            const index = this.state.dictionary.indexOf(sameWord[0]);
            this.setState({ dictionary: [...this.state.dictionary.slice(0, index), word, ...this.state.dictionary.slice(index + 1)] })
        }
        else
            this.setState({ dictionary: [word, ...this.state.dictionary] })

        this.setState({ filter: "", selectedword: "" })
    }

    setTheWord() {
        this.setState({ selectedword: this.selectedword.trim() })
    }

    componentDidMount() {
        console.log(1)
        this.getDictionary()
    }

    getProgress(word) {
        return (word.word_translation ? 1 : 0) * 25
            + (word.keyboard ? 1 : 0) * 25
            + (word.translation_word ? 1 : 0) * 25
            + (word.audio ? 1 : 0) * 25;
    }

    getDictionary() {
        fetch("/api/userword", {
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

                console.log(json)
                this.setState({ dictionary: json.response })
            }
        )
    }

    resetWord(words) {

        fetch("/api/userword", {
            method: "PATCH",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                body: words.map(word => {
                    return {
                        id: word.id
                    }
                })
            })
        }).then(response => response.json()).then(json => {

            let dictionary = this.state.dictionary.slice()
            const change = {
                audio: false,
                word_translation: false,
                translation_word: false,
                keyboard: false
            }
            words.forEach((word, index) => {
                if (dictionary.indexOf(word) != -1)
                    dictionary = [
                        ...dictionary.slice(0, dictionary.indexOf(word)), {
                            ...word,
                            ...change
                        },
                        ...dictionary.slice(dictionary.indexOf(word) + 1)
                    ]
            })

            this.setState({
                dictionary
            })
        })
    }

    deleteWord(words) {
        fetch("/api/userword", {
            method: "DELETE",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                body: words.map(word => {
                    return {
                        id: word.id
                    }
                })
            })
        }).then(response => response.json()).then(json => {
            console.log(json)
            let dictionary = this.state.dictionary.slice()
            words.forEach((word) => {
                console.log("indexing", this.state.dictionary.indexOf(word))
                if (dictionary.indexOf(word) != -1)
                    dictionary = [
                        ...dictionary.slice(0, dictionary.indexOf(word)),
                        ...dictionary.slice(dictionary.indexOf(word) + 1)
                    ]
            })

            this.setState({
                dictionary
            })
        })
    }

    play = () => {
        let audio = new Audio(this.state.audio);
        audio.play();
    }

    all() {
        return true;
    }

    zeros(progress) {
        return progress == 0;
    }

    inProgress(progress) {
        return progress > 0 && progress < 100
    }

    learned(progress) {
        return progress == 100
    }

    handleContextRef = contextRef => this.setState({ contextRef })

    handleUpdate = (e, { calculations }) => {
        if (calculations.height > window.innerHeight && this.state.stickyActive == false)
            this.setState({ stickyActive: true });
        if (calculations.height < window.innerHeight && this.state.stickyActive == true)
            this.setState({ stickyActive: false });
    }

    table() {

        const { contextRef } = this.state
        const words = this.state.dictionary.filter(word => {
            return (word.word.includes(this.state.filter) || word.translation.includes(this.state.filter)) & this.state.filterProgress(this.getProgress(word))
        });

        console.log(this.state.checked)
        return (
            <div ref={this.handleContextRef}
                style={{ position: "relative", marginTop: "-15px" }}
            >
                <Sticky context={contextRef} className="stick">
                    <Grid style={{
                        background: "#fff"
                    }}>
                        <Grid.Row>
                            <Grid.Column computer={6} tablet={6} mobile={16}>
                                <Input onChange={
                                    (event) => {
                                        this.selectedword = event.target.value
                                        this.setState({ filter: event.target.value.toLowerCase() })
                                    }
                                }
                                    value={this.state.filter}
                                    onKeyPress={
                                        (event) => {
                                            if (event.key == "Enter") {
                                                const filtered = this.state.dictionary.filter(word => {
                                                    return word.word == this.state.filter || word.translation == this.state.filter
                                                })
                                                if (filtered.length == 0) {

                                                    this.setTheWord()
                                                }

                                            }
                                        }
                                    }
                                    fluid
                                    icon={<Icon name="add" color="purple" inverted circular link onClick={
                                        () => this.setTheWord()
                                    } />} placeholder='Search' />
                            </Grid.Column>

                            <Grid.Column only='mobile' style={{ paddingTop: "10px" }}></Grid.Column>
                            <Grid.Column computer={6} tablet={10} mobile={16}>
                                <Button.Group fluid>
                                    <Button active={this.state.filterProgress == this.all} onClick={() => this.setState({ filterProgress: this.all })}>All</Button>
                                    <Button active={this.state.filterProgress == this.zeros} onClick={() => this.setState({ filterProgress: this.zeros })}>0%</Button>
                                    <Button active={this.state.filterProgress == this.inProgress} onClick={() => this.setState({ filterProgress: this.inProgress })}>~%</Button>
                                    <Button active={this.state.filterProgress == this.learned} onClick={() => this.setState({ filterProgress: this.learned })}>100%</Button>
                                </Button.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Sticky>

                <Visibility onUpdate={this.handleUpdate}>
                    <Table compact basic="very" style={{ marginTop: "10px", paddingTop: "50px" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell>Word</Table.HeaderCell>
                                <Table.HeaderCell>Translation</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Audio</Table.HeaderCell>
                                <Table.HeaderCell>Added</Table.HeaderCell>
                                <Table.HeaderCell>Learned %</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>


                        <Table.Body>
                            {

                                words.map(
                                    (word, key) => {
                                        let date = new Date(word.added)
                                        // console.log(word)

                                        const percent = this.getProgress(word)
                                        return (

                                            <Table.Row key={key}>
                                                <Table.Cell>
                                                    <Checkbox checked={this.state.checked.indexOf(word) != -1 ? true : false} value={word.id} onChange={
                                                        (event, { value, checked }) => {
                                                            if (checked) {
                                                                this.setState({ checked: [...this.state.checked, word] })
                                                            }
                                                            else {
                                                                this.setState({ checked: [...this.state.checked.slice(0, this.state.checked.indexOf(word)), ...this.state.checked.slice(this.state.checked.indexOf(word) + 1)] })
                                                            }
                                                        }
                                                    } />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {word.word}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {word.translation}
                                                </Table.Cell>
                                                
                                                <Table.Cell>
                                                    <Icon name="file audio" style={{"cursor":"pointer"}} onClick={
                                                        () => {
                                                            let audio = new Audio(word.audio_clip);
                                                            audio.play();
                                                        }
                                                    }
                                                    />
                                                </Table.Cell>
                                                <Table.Cell singleLine>
                                                    {
                                                        `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`
                                                    }
                                                </Table.Cell>
                                                <Table.Cell verticalAlign="middle">
                                                    <Progress value={percent} indicating progress='value' style={{ margin: 0 }} />
                                                </Table.Cell>
                                                <Table.Cell collapsing>
                                                    <Button.Group compact>
                                                        <Button color="red" onClick={
                                                            () => this.openModal("Are you sure?", `Are you sure you want to delete word ${word.word}?`, () => this.deleteWord([word]))
                                                        }>Delete</Button>
                                                        <Button color="purple" onClick={
                                                            () => this.openModal("Are you sure?", `Are you sure you want to reset the progress of word ${word.word}?`, () => this.resetWord([word]))
                                                        }>Learn again</Button>
                                                    </Button.Group>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                )

                            }
                            {

                                words.length == 0 ?
                                    <Table.Row>
                                        <Table.Cell>
                                            No words
                                </Table.Cell>
                                    </Table.Row> :
                                    <Table.Row>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>
                            }
                        </Table.Body>
                    </Table>

                </Visibility>

            </div>
        )
    }

    abort() {
        this.setState({ selectedword: "" })
    }
    modal = {
        text: "",
        helper: "",
        action: () => {

        }
    }

    openModal(text, helper, action) {
        this.modal = {
            text,
            helper,
            action
        }
        this.setState({
            open: true
        })
    }

    renderBottom() {
        if (this.state.checked.length > 0)
            return (

                <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                    <Container textAlign="center" >
                        <Grid centered>
                            <Grid.Row>
                                <Grid.Column computer={7} tablet={9} mobile={16}>
                                    <div className="bottomRender">
                                        {this.state.checked.length} selected word &nbsp;
<Button.Group compact>
                                            <Button color="red" onClick={
                                                () => this.openModal("Are you sure?", `Are you sure you want to delete words?`, () => {
                                                    const words = this.state.checked.slice();
                                                    this.setState({ checked: [] })
                                                    this.deleteWord(words);
                                                })
                                            }>Delete</Button>
                                            <Button color="purple" onClick={
                                                () => this.openModal("Are you sure?", `Are you sure you want to reset the progress of words?`, () => {

                                                    const words = this.state.checked.slice();
                                                    this.setState({ checked: [] })
                                                    this.resetWord(words)
                                                })
                                            }>Learn again</Button>
                                        </Button.Group>

                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>

            )
    }

    render() {
        const { open } = this.state
        return (
            <div>

                {
                    this.table()
                }
                {

                    this.renderBottom()
                }



                <WordModal data={{
                    selectedword: this.state.selectedword
                }} abort={this.abort} addToDictionary={this.addToDictionary} />
                <Modal size={"mini"} open={open} onClose={() => this.setState({ open: false })}>
                    <Modal.Header>{this.modal.text}</Modal.Header>
                    <Modal.Content>
                        <p>{this.modal.helper}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive onClick={() => this.setState({ open: false })}>No</Button>
                        <Button negative onClick={
                            () => {
                                this.modal.action()
                                this.setState({ open: false })
                            }
                        } icon='checkmark' labelPosition='right' content='Yes' />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}