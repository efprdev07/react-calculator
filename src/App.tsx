import React from 'react';

import { EstimatorContext } from './components/Contexts';
import { Estimator, ISelectedService } from './components/Estimator';
import { Header } from './components/Header';
import { Sections } from './components/Sections';
import { Tabs } from './components/Tabs';
import { questionnaire } from './data/questionnaire';

interface IState {
    currentTab: number;
    selectedServices: IObject<ISelectedService>;
    showModal: boolean;
}

export class App extends React.PureComponent<{}, IState> {
    public state: IState = {
        currentTab: 0,
        selectedServices: {},
        showModal: false,
    }

    public render() {
        const { currency, title, tabs, estimatorTitle } = questionnaire;
        const { currentTab, selectedServices, showModal } = this.state;
        return (
            <EstimatorContext.Provider
                value={{
                    onChoiceSelected: (sectionID: number, questionID: number, choiceID: number, isDefault: boolean = false) => this.updateCost(sectionID, questionID, choiceID, isDefault)
                }}
            >
                <div className='row'>
                    <div className='col'>
                        <Header
                            title={title}
                            currency={currency}
                            onEstimateToggle={this.onEstimateToggle}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8 col-sm-12'>
                        <Tabs
                            tabs={tabs}
                            activeTabIndex={currentTab}
                            onTabClicked={this.onTabClick}
                        />
                        <div style={{ height: 'calc(100vh - 98px)', overflowY: 'scroll' }}>
                            <Sections sections={tabs[currentTab].sections}/>
                        </div>
                    </div>
                    <div className='col-md-4 d-none d-sm-block'>
                        <Estimator
                            title={estimatorTitle}
                            currency={currency}
                            selectedServices={selectedServices}
                        />
                    </div>
                </div>
                <div className={`modal fade${showModal ? ' show' : ''}`} role='dialog' style={{ display: showModal ? 'block' : 'none' }}>
                    <div className='modal-dialog' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Estimate</h5>
                                <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={this.hideModal}>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <Estimator
                                    title={estimatorTitle}
                                    currency={currency}
                                    selectedServices={selectedServices}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </EstimatorContext.Provider>
        );
    }

    private onTabClick = (tabIndex: number) => {
        this.setState({
            currentTab: tabIndex,
            selectedServices: {}
        })
    }

    private updateCost = (sectionID: number, questionID: number, choiceID: number, isDefault: boolean) => {
        const { selectedServices, currentTab } = this.state;
        const index = Object.keys(selectedServices).length;
        const selectedQuestion = questionnaire.tabs[currentTab].sections[sectionID].questions[questionID]
        const selectedChoice = selectedQuestion.options[choiceID];
        const { pseudoTitle } = selectedQuestion;
        const { range } = selectedChoice;
        if (selectedServices[pseudoTitle]) {
            this.setState({
                selectedServices: {
                    ...selectedServices,
                    [pseudoTitle]: {
                        ...selectedServices[pseudoTitle],
                        title: pseudoTitle,
                        range,
                    }
                }
            });
        } else {
            this.setState({
                selectedServices: {
                    ...selectedServices,
                    [pseudoTitle]: {
                        order: index,
                        title: pseudoTitle,
                        range,
                    }
                }
            });
        }
    }

    private showModal = () => {
        this.setState({
            showModal: true
        })
    }

    private hideModal = () => {
        this.setState({
            showModal: false
        })
    }

    private onEstimateToggle = () => {
        this.showModal();
    }
}