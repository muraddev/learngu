import React from 'react'
// import data from './data'
import { Segment, Form, Icon, Header } from 'semantic-ui-react';

export default class AudioWord extends React.Component {
    constructor(props) {
        super(props);
        this.question = props.question;
        this.state = {
            status: false,
            answered: false
        }
        this.typing = { value: "" }
    }

    componentDidMount() {
        this.play()
    }

    check() {
        console.log(this.typing, this.typing.value)
        const condition = this.question.word.trim().toLowerCase().replace(/[\W_]+/g, "") == this.typing.value.trim().toLowerCase().replace(/[\W_]+/g, "")


        this.setState({
            status: condition,
            answered: true
        })

        this.props.checked({
            ...this.question,
            answer: this.typing.value,
            found: condition
        })
    }

    play() {
        if (this.audio == null)
            this.audio = new Audio(this.question.audio_clip);
        this.audio.play();
    }
    render() {

        return (
            <div>
                <div style={{ textAlign: "center", padding: "27px 0", cursor: "pointer" }}>
                    <Icon name="play" onClick={() => this.play()} size="huge" color="purple" />
                </div>
                <div style={{ display: this.state.answered ? "block" : "none", textAlign: "center" }}>
                    <Header as='h2' textAlign="center">
                        <Header.Content>
                            {this.question.word}
                            <Header.Subheader>{this.question.translation}</Header.Subheader>
                        </Header.Content>
                    </Header>

                    <span className={this.state.status ? "correct" : "wrong"}>{this.state.status ? "correct" : "wrong"}</span>

                    <Header as="h2" textAlign="center"
                        style={{
                            marginTop: 10,
                            display: (this.state.status || this.typing.value.trim() == "") ? "none" : "block"
                        }} color="red">
                        <Header.Content>
                            {this.typing.value}
                        </Header.Content>
                    </Header>

                </div>
                <div style={{ display: this.state.answered ? "none" : "block" }}>
                    <Form>
                        <Form.Field>
                            <label>Write what you hear!</label>
                            <input placeholder='Here' ref={typing => this.typing = typing}
                                onKeyPress={
                                    (event) => {
                                        if (event.key == "Enter")
                                            this.check();
                                    }
                                } />
                        </Form.Field>
                    </Form>
                </div>


                {

                    !this.state.answered ?
                        <Segment onClick={() => this.check()} color="purple" inverted style={{ cursor: "pointer" }}>
                            {"Check"}
                        </Segment>
                        :
                        <Segment color="purple" inverted onClick={() => this.props.next()} style={{ cursor: "pointer" }}>Next</Segment>
                }

            </div>

        )
    }
}