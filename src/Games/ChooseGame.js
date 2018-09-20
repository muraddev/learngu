import React from 'react'
import { Segment } from 'semantic-ui-react';

export default class ChooseGame extends React.Component {
    constructor(props) {
        super(props);
        
        this.question = props.question;
        this.checkable = (this.props.game=="word"?this.question.translation:this.question.word)
        this.variants = this.shuffle([...this.question.variants, this.checkable])
        this.state = {
            status: false,
            done: -1
        }
    }

    makeIt() {

    }

    shuffle(array) {
        let temparr = [];
        let indexes = [];
        while (true) {
            const number = Math.floor(Math.random() * array.length);
            if (indexes.indexOf(number) == -1) {
                indexes.push(number);
                temparr.push(array[number])
            }

            if (indexes.length >= array.length)
                break;
        }
        //console.log(temparr);

        return temparr;
    }

    check(word, i) {
        if (this.state.done != -1)
            return;

        const condition = 
        (word == this.checkable)
        if (condition) {
            this.setState({
                done: i,
                status: true
            })
        }
        else {
            this.setState({
                done: i,
                status: false
            })
        }
        this.props.checked({
            ...this.question,
            answer:word,
            found: condition
        })
    }
    render() {
        
        return (
            <div>
                <h2>{this.props.game=="word"?this.question.word:this.question.translation}</h2>
                <div>
                    {
                        this.variants.map((variant, i) => {
                            return (
                                <Segment style={{ cursor: "pointer" }} key={i} onClick={() => this.check(variant, i)}
                                    color={(
                                        this.state.done != -1 ? this.state.status && i == this.state.done || this.checkable == variant ?
                                            "green" : !this.state.status && i == this.state.done ? "red" : 'grey' : 'grey'
                                    )}

                                    inverted={Boolean(this.state.done != -1 & (i == this.state.done || this.checkable == variant))}

                                    onClick={() => this.check(variant, i)}>
                                    {variant} 
                                </Segment>
                            )
                        })

                    }
                </div>

                <Segment color="purple" inverted={true} style={{ display: this.state.done != -1 ? "block" : "none",cursor:"pointer" }} onClick={() => this.props.next()}>Next</Segment>

            </div>

        )
    }
}