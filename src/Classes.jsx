import React from 'react'
import { Grid, Header, Icon, GridColumn, Segment } from 'semantic-ui-react';

export const Result = (props) => {
    return (
        <div>
            <Header as='h1' icon textAlign='center' style={{ paddingTop: 40 }}>
                <Icon name='like' />
                <Header.Content>Done!</Header.Content>
            </Header>
            <Grid columns={2}>
                <Grid.Row textAlign="center">
                    <Grid.Column>
                        <Header as='h2' icon>
                            <Icon name='checkmark' color="green" />
                            Succeeded: {props.success}
                        </Header>
                    </Grid.Column>
                    <GridColumn>
                        <Header as='h2' icon>
                            <Icon name='cancel' color="red" />
                            Failed: {props.fail}
                        </Header>
                    </GridColumn>
                </Grid.Row>
            </Grid>

            <Segment color="blue" inverted={true} style={{ cursor: "pointer" }} onClick={() => props.restart()}> Do it again!</Segment>
            <Segment color="black" inverted={true} style={{ cursor: "pointer" }} onClick={() => props.goTotraining()}>Back to tainings</Segment>
        </div>
    )
}
