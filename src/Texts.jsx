import React from 'react'
import { Button, Icon, Grid, GridRow, Card, Segment, Modal, Form, TextArea, Message, Loader, Dimmer, GridColumn } from 'semantic-ui-react';
import { getCookie } from './functions';
import Main from './Main';

export default class Text extends React.Component {
    constructor(props) {
        super(props);
        this.reserve = null;
        this.state = {
            read: {
                title: "",
                context: ""
            },
            delete: {
                show: false,
                action: null
            },
            texts: [],
            textmodal: false,
            text: {
                id: 0,
                title: "",
                context: ""
            },
            errors: [],
            loading: true,
            language:''
        }
    }

    componentDidMount() {
        fetch("/api/text", {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then(response => response.json()).then(json => {
            this.setState({ texts: json.data, loading: false,language:json.language })
            console.log(json)
        }).catch(error => console.log(error))
    }

    sendData() {
        let errors = []
        console.log(this.state)
        if (this.state.text.title.trim() == "")
            errors.push("Title field is empty")

        if (this.state.text.context.trim() == "")
            errors.push("Text field is empty")
        console.log(errors)
        this.setState({ errors })
        if (errors.length == 0) {

            this.setState({ loading: true })
            fetch("/api/text", {
                method: this.state.text.id == 0 ? "POST" : "PUT",
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, same-origin, *omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify(this.state.text)
            }).then(
                response => response.json()
            ).then(
                json => {
                    console.log(json)
                    if (this.reserve != null) {
                        this.setState({
                            texts: [
                                ...this.state.texts.slice(0, this.state.texts.indexOf(this.reserve)),
                                json.text, ...this.state.texts.slice(this.state.texts.indexOf(this.reserve) + 1)
                            ], loading: false, textmodal: false
                        })
                    }
                    else {
                        console.log(json)
                        this.setState({
                            texts: [
                                json.text, ...this.state.texts
                            ], loading: false, textmodal: false
                        })
                    }
                }
            ).catch()
        }
    }

    deleteItem(item) {
        this.setState({ delete: { show: false, action: null } })

        fetch("/api/text", {
            method: "DELETE",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ id: item.id })
        }).then(
            (response) => response.json()
        ).then(
            json => {
                this.setState({
                    texts: [
                        ...this.state.texts.slice(0, this.state.texts.indexOf(item)), ...this.state.texts.slice(this.state.texts.indexOf(item) + 1)
                    ]
                })
            }
        )
    }

    edit(text) {
        this.reserve = text
        this.setState({
            loading:true
        })

        fetch("/api/text?id=" + text.id, {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then(response => response.json()).then(json => {
            // this.setState({ texts: json.data, loading: false })
            this.setState({ text: { ...json.data }, textmodal: true, errors: [],loading:false })
        }).catch(error => console.log(error))
    }
    read(text){
        this.setState({ loading:true })
        

        fetch("/api/text?id=" + text.id, {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then(response => response.json()).then(json => {
            // this.setState({ texts: json.data, loading: false })
            this.setState({read:{...json.data},loading:false })
        }).catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <Dimmer page active={this.state.loading}>
                    <Loader>Loading</Loader>
                </Dimmer>
                <Button icon labelPosition='left' color="purple" onClick={
                    () => {
                        this.reserve = null;

                        this.setState({
                            textmodal: true,
                            text: {
                                id: 0,
                                title: "",
                                context: ""
                            },
                            errors: []
                        })
                    }
                }>
                    <Icon name='add' />
                    Add new text in {this.state.language}
                </Button>
                {/* <Segment color="purple"> */}

                <Grid stretched style={{ marginTop: "5px" }} divided="vertically">
                    <Grid.Row>
                        {
                            this.state.texts.map((text, key) => {
                                return (
                                    <Grid.Column mobile={16} computer={4} tablet={8} key={key}>
                                        <Card color="purple" fluid>
                                            <Card.Content header={<div>{text.title} <Icon name="edit" /></div>} onClick={
                                                () => {
                                                    this.edit(text)
                                                }} style={{ cursor: "pointer" }} />
                                            <Card.Content extra>
                                                <Button.Group widths={2}>
                                                    <Button basic color='purple' onClick={
                                                        () => {
                                                            this.read(text);
                                                        }
                                                    }>
                                                        Read
                                                        </Button>
                                                    <Button basic color='red' onClick={
                                                        () => {
                                                            this.setState({
                                                                delete: {
                                                                    show: true,
                                                                    action: () => {
                                                                        this.deleteItem(text)
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }>
                                                        Delete
                                                    </Button>
                                                </Button.Group>
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                )
                            })
                        }
                        {
                            this.state.texts.length == 0 ? (
                                <Grid.Column>
                                    You do not yet have any texts to read
                                </Grid.Column>) : ""
                        }
                    </Grid.Row>
                </Grid>
                {/* </Segment> */}
                <Modal size={'small'} dimmer="blurring" open={this.state.textmodal} onClose={
                    () => this.setState({ textmodal: false })
                }>
                    <Modal.Header>Your text</Modal.Header>
                    <Modal.Content scrolling>
                        <Form>
                            <Form.Field>
                                <label>Title</label>
                                <input value={this.state.text.title} placeholder='Tile of the text' onChange={event => this.setState({ text: { ...this.state.text, title: event.target.value } })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Text</label>
                                <TextArea autoHeight placeholder='Write your text or copy and paste it here' value={this.state.text.context} onChange={event => this.setState({ text: { ...this.state.text, context: event.target.value } })} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        {
                            this.state.errors.length > 0 ? (

                                <Message color="red" style={{ textAlign: "left" }}>
                                    {
                                        this.state.errors.map((error, key) => (
                                            <li key={key}>{error}</li>
                                        ))
                                    }
                                </Message>) : ""
                        }
                        <Button negative basic onClick={() => this.setState({ textmodal: false })}>Cancel</Button>
                        <Button positive icon='checkmark' basic labelPosition='right' content='Save' onClick={() => this.sendData()} />
                    </Modal.Actions>
                </Modal>
                {/* Context Modal */}
                <Modal size={'large'} open={this.state.read.title != ""} onClose={
                    () => this.setState({
                        read: {
                            title: "",
                            context: ""
                        }
                    })
                }>
                    <Modal.Header>{this.state.read.title}</Modal.Header>
                    <Modal.Content scrolling>
                        <Main sentence={this.state.read.context} />
                        {/* {this.state.read.context} */}
                    </Modal.Content>
                </Modal>

                {/* DeleteModal */}

                <Modal size={'small'} dimmer="blurring" open={this.state.delete.show} onClose={
                    () => this.setState({ delete: { show: false, action: null } })
                }>
                    <Modal.Header>Your text</Modal.Header>
                    <Modal.Content>
                        Are you sure to delete this text?
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive basic onClick={() => this.setState({ delete: { show: false, action: null } })}>Cancel</Button>
                        <Button negative icon='trash' basic labelPosition='right' content='Delete' onClick={() => this.state.delete.action()} />
                    </Modal.Actions>
                </Modal>

            </div>
        )
    }
}