import React from 'react'
import { getCookie } from './functions';
import { Grid, GridColumn, Segment, Table, Input, Form, Header, Select, Button, Dimmer, Loader } from 'semantic-ui-react';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            language: "",
            avatar: "",
            langs: [],
            loading: true
        }
    }

    componentDidMount() {
        fetch("/api/user_profile", {
            method: "GET",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            }
        }).then(response => response.json()).then(json => {
            console.log(json);
            this.setState({
                ...json,
                loading:false
            })
        })
    }
    save() {
        this.setState({
            loading:true
        })
        fetch("/api/user_profile", {
            method: "PUT",
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(this.state)
        }).then(response => response.json()).then(json => {
            console.log(json);
            this.setState({
                loading:false
            })
        })
    }
    render() {
        console.log(this.state)

        return <div>
            
                <Dimmer page active={this.state.loading}>
                    <Loader>Loading</Loader>
                </Dimmer>
            
            <Grid centered>
                <Grid.Row>
                    <Grid.Column computer={8} tablet={12} mobile={16}>
                        <Segment color="purple">
                            <Form>
                                <Table basic="very">
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>
                                                Username: {this.state.username}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                Email: {this.state.email}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <Form.Field>
                                                    <label>First Name</label>
                                                    <input placeholder='First Name' value={this.state.first_name} onChange={(event) => {
                                                        this.setState({ first_name: event.target.value })
                                                    }} />
                                                </Form.Field>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <Form.Field>
                                                    <label>Last Name</label>
                                                    <input placeholder='Last Name' value={this.state.last_name} onChange={(event) => {
                                                        this.setState({ last_name: event.target.value })
                                                    }} />
                                                </Form.Field>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <Form.Field>
                                                    <label>Learn</label>

                                                    <select value={this.state.language} onChange={(event) => {
                                                        this.setState({ language: event.target.value })
                                                    }}>
                                                        {
                                                            this.state.langs.map((item,key) => {
                                                                return (
                                                                    <option key={key} value={item[0]}>{item[1]}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </Form.Field>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <Button fluid color="purple" onClick={() => this.save()}>Save</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    }
}