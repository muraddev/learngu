import React from 'react';
import data from "./data";
import WordByWord from './WordByWord'
import { Grid, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { getCookie } from '../functions';
import { Result } from '../Classes';
import {Redirect} from 'react-router-dom'
import Word from './Word';

export default class Keyboard extends Word {

    componentDidMount() {
        this.getData("keyboard");
        this.setState({training:"keyboard"})
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
                    <Grid.Column computer={8} tablet={12} mobile={16}>
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