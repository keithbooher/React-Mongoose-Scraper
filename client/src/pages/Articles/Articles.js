import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article";
import Jumbotron from "../../components/Jumbotron";
import { H1, H3, H4 } from "../../components/Headings";
import { Container, Row, Col } from "../../components/Grid";
import { Panel, PanelHeading, PanelBody } from "../../components/Panel";
import { Form, Input, FormBtn, FormGroup, Label } from "../../components/Form";

export default class Articles extends Component {
    // Default State
    state = {
        topic: "",
        startYear: "",
        endYear: "",
        page: 0,
        results: [],
        previousSearch: {},
        noResults: false
    };

    // Save article function
    saveArticle = (article) => {
        let newArticle = {
            date: article.pub_date,
            title: article.headline.main,
            url: article.web_url,
            summary: article.snippet
        }

        // Callback to API on backend
        API
            .saveArticle(newArticle)
            .then(results => {
                let unsavedArticles = this.state.results.filter(article => article.headline.main !== newArticle.title)
                this.setState({results: unsavedArticles})
                console.log("Articles Test")
            })
            .catch(err => console.log(err));
    }

    // Function to handle form input
    handleInputChange = event => {
        let { name, value } = event.target;
        this.setState({[name] : value})
    };

    // Function to handle form submit
    handleFormSubmit = event => {
        event.preventDefault();
        let { topic, startYear, endYear } = this.state;
        let query = { topic, startYear, endYear }
        this.getArticles(query)
    }

    // Function that gets articles from NYT API
    getArticles = query => {
        if(query.topic !== this.state.previousSearch.topic ||
            query.startYear !== this.state.previousSearch.startYear ||
            query.endYear !== this.state.previousSearch.endYear) {
                this.setState({ results: [] })
            }
            let { topic, startYear, endYear } = query
            let queryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&page=${this.state.page}`
            let nytKey = `&api-key=4629b1672f0246958ce1ef8793a12633`

            //Use regex to remove spaces to build query url
            if(topic.indexOf(' ')>=0) {
                topic = topic.replace(/\s/g, '+');
            }
            if(topic) {
                queryUrl += `&fq=${topic}`
            }
            if(startYear) {
                queryUrl += `&begin_date=${startYear}`
            }
            if(endYear) {
                queryUrl += `&end_date=${endYear}`
            }
            queryUrl += nytKey;
            console.log(queryUrl)
            API
                .queryNYT(queryUrl)
                .then(results => {
                    this.setState({
                        results: [...this.state.results, ...results.data.response.docs],
                        previousSearch: query,
                        topic: "",
                        startYear: "",
                        endYear: ""
                    }, function (){
                        this.state.results.length === 0 ? this.setState({noResults: true}) : this.setState({noResults: false})
                    });
                })
                .catch(err => console.log(err))

    }

    getMoreResults = () => {
        let { topic, startYear, endYear } = this.state.previousSearch;
        let query = { topic, endYear, startYear }
        let page = this.state.page;
        page++
        this.setState({page: page}, function () {
            this.getArticles(query)
        });
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col size="sm-10 offset-'sm-1">
                        <Jumbotron>
                            <H1 className="page-header text-center">New York Times Article Search</H1>
                            <H4 className="text-center">Search for Articles and save them!</H4>
                        </Jumbotron>
                        <Panel>
                            <PanelHeading>
                                <H3>Search</H3>
                            </PanelHeading>
                            <PanelBody>
                                <Form style={{marginBottom: "30px"}}>
                                    <FormGroup>
                                        <Label htmlFor="topic">Enter a topic to search for:</Label>
                                        <Input
                                            onChange={this.handleInputChange}
                                            name="topic"
                                            value={this.state.topic}
                                            placeholder="Topic"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="startYear">Enter a beginning date to search for:</Label>
                                        <Input
                                            onChange={this.handleInputChange}
                                            type="date"
                                            name="startYear"
                                            value={this.state.startYear}
                                            placeholder="Start Year"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="endYear">Enter an end date to search for:</Label>
                                        <Input
                                            onChange={this.handleInputChange}
                                            type="date"
                                            name="endYear"
                                            value={this.state.endYear}
                                            placeholder="End Year"
                                        />
                                    </FormGroup>
                                    <FormBtn
                                        disabled={!(this.state.topic)}
                                        onClick={this.handleFormSubmit}
                                        type="info"
                                    >
                                        Submit
                                    </FormBtn>
                                </Form>
                            </PanelBody>
                        </Panel>
                        {this.state.noResults ?
                            (<H1>No results Found. Please try again</H1>) :
                            this.state.results.length>0 ? (
                                <Panel>
                                    <PanelHeading>
                                        <H3>Results</H3>
                                    </PanelHeading>
                                    <PanelBody>
                                        {
                                            this.state.results.map((article, i) => (
                                                <Article
                                                    key={i}
                                                    title={article.headline.main}
                                                    url={article.web_url}
                                                    summary={article.snippet}
                                                    date={article.pub_date}
                                                    type="Save"
                                                    onClick={() => this.saveArticle(article)}
                                                />
                                                )
                                            )
                                        }
                                            <FormBtn type="warning" additional="btn-block" onClick={this.getMoreResults}>Get More results</FormBtn>
                                    </PanelBody>
                                </Panel>
                            ) : ""
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}