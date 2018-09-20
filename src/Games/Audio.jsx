import Word from "./Word";
import React from "react";
import {Redirect} from "react-router-dom"
import { Dimmer, Loader, Grid, Segment } from "semantic-ui-react";
import { Result } from "../Classes";
import AudioWord from "./AudioWord"

export default class AudioGame extends Word {

    componentDidMount() {
        this.getData("audio");
        this.setState({ training: "audio" })
    }

    render() {

        if (this.state.trainings)
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
                                        return <AudioWord question={word} key={i} checked={this.checked} next={this.goNext} />
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
        </div>)
    }

}