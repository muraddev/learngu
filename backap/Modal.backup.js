import React, { Component } from 'react'
import { getCookie } from './functions';
import { Segment, Grid, GridRow, List } from 'semantic-ui-react';

export default class Modal extends Component {
    show() {
        return (
            <div id="exit" style={{ position: "fixed", width: "100%", height: "100%", top: 0, left: 0, backgroundColor: "rgba(0,0,0,.6)", display: "flex", alignItems: "center" }} onClick={(event) => {

                console.log(event.target.id, event.target.className == "row")
                if (event.target.id == "exit" || event.target.className == "row") {
                    // this.setState({data:false})
                    this.props.abort()
                }

            }}>
                <Grid style={{ width: "100%" }} centered>
                    <Grid.Row>
                        <Grid.Column mobile="14" tablet="8" computer="6">
                            <Segment id="content"
                                style={{ padding: "15px 7px 7px" }}
                            >
                                <span style={{ fontSize: 30 }}>{this.props.data.selectedword}</span> <i style={{ visibility: this.props.data.audio == "" ? "hidden" : "visible", cursor: "pointer" }} className="fas fa-volume-up" onClick={
                                    () => {
                                        this.props.play()
                                    }
                                }></i>
                                <div className="" style={{ fontSize: "16", paddingTop: "6px" }}>
                                    <List selection animated verticalAlign='middle'>
                                        {
                                            this.props.data.translations.map((word, key) => {
                                                return (
                                                    <List.Item style={{ color: "black" }} key={key} onClick={() => this.setTranslation(this.props.data.id, word.text)}>
                                                        {word.text}
                                                    </List.Item>
                                                )
                                            })
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
                this.props.abort()
            }
        )
    }
    

    render() {
        if (this.props.data.selectedword != "")
            return this.show()
        else
            return <span></span>
    }
}