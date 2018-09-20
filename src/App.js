import React, { Component } from 'react';
// import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


class App extends Component {
  getWords(){
    let sentence = this.props.sentence
    var regex = /(<([^>]+)>)/ig
    sentence =sentence.replace(/(?:\r\n|\r|\n)/g,"<br> ")
    let words = sentence.split(/[^a-zA-ZöÖğĞıIəƏşŞçÇÅå^Ää<>'`’]+/);
    let symbols = sentence.split(/[a-zA-ZöÖğĞıIəƏşŞçÇÅå^Ää<>'`’]+/);
    sentence = [];
    words.map((word,i)=>{
      if(symbols[i]!=null)
        sentence.push(symbols[i]);
      sentence.push(word);
    });
    
    // return sentence.map((word,i)=>!/^br$/.test(word)?<span onClick={()=>this.props.slct(word)} className={/[a-zA-Z]+/.test(word)?'highlight':''} key={i}>{word}</span>:<br key={i} />
    // )
    return sentence.map((word,i)=>!/(<([^>]+)>)/.test(word)?!/[!@#$%^&*().,// ]+/.test(word)?<span onClick={()=>this.props.slct(word)} className={/[a-zA-Z]+/.test(word)?'highlight':''} key={i}>{word}</span>:word:<br key={i} />
    )
  }

  render() {
    return(
      <div>
        
        {this.getWords()}
      </div>
    )
  }
}

export default App;
