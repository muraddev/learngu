import React from 'react';
import {shuffle} from '../functions'
import { Segment } from 'semantic-ui-react';

export default class WordByWord extends React.Component{
    constructor(props){
        super(props);
        this.word = props.word;
        this.isGood=false;
        this.state={
            answer:[],
            answered:false
        }
        this.shuffled = shuffle(this.word.split(""));
    }
 
    check(){
        const answer = this.state.answer.map((obj)=>obj.letter).join("")
        if(answer==this.props.word){
            this.isGood=true;
        }
        this.setState({
            answered:true
        })
        this.props.checked({...this.props.question,found:this.isGood,answer:answer})
    }

    select(letter,index){
        const newLetter = {letter,index};
        //console.log(newLetter);
        let answer = [...this.state.answer,{letter,index}];
        this.setState({answer});
    }

    unselect(letter){
        let answer=[...this.state.answer];
        answer.splice(answer.findIndex(lett=>lett.index==letter.index),1);

        this.setState({
            answer,
            answered:false
        })
    }

    render(){
        //console.log(this.props);
        return(
        <div>
            <h2>
                {this.props.translation}
            </h2>
            <div style={{lineHeight:'40px', minHeight:"40px"}}>
                {
                    !this.state.answered?
                    this.state.answer.map((letter,i)=>{
                        return <span className="letterSelected" onClick={()=>this.unselect(letter)} key={i}>{letter.letter}</span>
                    })
                    :
                    this.props.word.split("").map((letter,i)=>{
                        return <span className={"letterSelected"+(this.isGood?" correct":" wrong").toString()} key={i}>{letter}</span>
                    })

                }
            </div>
            <hr style={{margin:"10px 0"}} />
            <div style={{marginBottom:'10px'}}>
                {
                    this.shuffled.map((letter,index)=>{
                        //console.log(this.state.answer.indexOf({letter,index}));
                        return this.state.answer.findIndex(a=>a.index==index)==-1?<span className="letter" key={index} onClick={
                            ()=>this.select(letter,index)
                        }>{letter}</span>:null;
                    })
                }
            </div>
            <div>


            </div>
            {
                
                !this.state.answered?
                <Segment onClick={()=>this.check()} color="purple" inverted  style={{cursor:"pointer"}}>
                {this.state.answer.length!=this.shuffled.length?"Skip":"Check"}
                </Segment>
                :
                <Segment color="purple" inverted onClick={()=>this.props.next()} style={{cursor:"pointer"}}>Next</Segment>
            }

        </div>
            )
    }
}