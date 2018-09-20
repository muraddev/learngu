import Word from "./Word";

export default class Translation extends Word{
    
    componentDidMount() {
        this.getData("translation");
        this.setState({training:"translation"})
    }
}