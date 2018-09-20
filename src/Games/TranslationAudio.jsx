import React from 'react'
import Word from './Word';

export default class TranslationAudio extends Word{
    
    componentDidMount() {
        this.getData("translation_audios");
        this.setState({training:"translation"})
    }

    render(){
        return(<div>OK</div>)
    }
}