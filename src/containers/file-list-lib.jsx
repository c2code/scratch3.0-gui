import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import png1 from './5.1.png';
import storage from '../lib/storage';
import {projectTitleInitialState, setProjectTitle} from '../reducers/project-title';
import LibraryComponent from '../components/library/library.jsx';
import {defineMessages, injectIntl, intlShape} from "react-intl";
import analytics from "../lib/analytics";
import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';
import {closeLoadingProject, openLoadingProject} from "../reducers/modals";


/**
 * Project saver component passes a saveProject function to its child.
 * It expects this child to be a function with the signature
 *     function (saveProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <ProjectSaver>{(saveProject, props) => (
 *     <MyCoolComponent
 *         onClick={saveProject}
 *         {...props}
 *     />
 * )}</ProjectSaver>
 */
const messages = defineMessages({
    filelistTitle: {
        defaultMessage: 'Choose an File',
        description: 'Heading for the extension library',
        id: 'gui.filelistLibrary.chooseAnExtension'
    }
    // extensionUrl: {
    //     defaultMessage: 'Enter the URL of the extension',
    //     description: 'Prompt for unoffical extension url',
    //     id: 'gui.extensionLibrary.extensionUrl'
    // }
});
class FileListLib extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'GetProjectFile',
            'handleItemSelect'
            // 'setProjectName'
        ]);
        this.state = {
            data: []
        };
    }

    componentWillMount (){
        // this.props.onSetProjectTitle('1');
        this.GetProjectFile().then(res => {
            this.setState({data: res});
        });
    }


    GetProjectFile () {
        return new Promise((resolve, reject) => {
            const XHR = new XMLHttpRequest();
            const url = 'http://test.tuopinpin.com/gui/download/';
            const form = new FormData();
            XHR.open('POST', url, true);
            let usernameStr = '';
            const usernames = document.cookie.split(';');
            for (let count =0; count < usernames.length; count++){
                const username = usernames[count].split('=');
                if(username[0].toString() === 'username' || username[0].toString() === ' username'){
                    usernameStr = username[1].toString();
                }
            }
            form.append('author', usernameStr);

            XHR.onreadystatechange = function () {
                if (XHR.readyState === 4) {
                    if (XHR.status === 200) {
                        try {
                            const data = [];
                            const res = JSON.parse(XHR.response);
                            let count = 0;
                            while (count < res.length){
                                if (res[count].image === null){
                                    const tempdata = {
                                        name: res[count].name,
                                        iconURL: png1,
                                        file: res[count].file
                                    };
                                    data.push(tempdata);
                                } else {
                                    const tempdata = {
                                        name: res[count].name,
                                        iconURL: res[count].image,
                                        file: res[count].file
                                    };
                                    data.push(tempdata);
                                }
                                count++;
                            }
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    }
                }
            };
            if (usernameStr === ''){
                alert('please login');
            } else {
                XHR.send(form);
            }
        });
    }

    // setProjectName (name) {
    //     this.props.onSetProjectTitle(name);
    // }

    handleItemSelect (item) {
        const fileName = item.name.split('.sb3')[0];
        this.props.onSetProjectTitle(fileName);
        // console.log(item)
        const url = item.file;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        const props = this.props;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(xhr.response);
                    reader.onload = function (){
                        props.loadProject(reader.result);
                    };
                }
            }
        };
        xhr.send();
    }

    render () {
        // console.log(this.state.data.length);
        // console.log(this.props.testprop);
        const extensionLibraryThumbnailData = this.state.data.map(extension => ({
            rawURL: extension.iconURL,
            ...extension
        }));
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={false}
                id="fileListLib"
                title={this.props.intl.formatMessage(messages.filelistTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}


FileListLib.propTypes = {
    intl: intlShape.isRequired,
    loadProject: PropTypes.func,
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    onSetProjectTitle: PropTypes.func,
    testprop: PropTypes.string,
    visible: PropTypes.bool
};

const mapStateToProps = state => ({
    loadProject: state.scratchGui.vm.loadProject.bind(state.scratchGui.vm)
});

// const mapDispatchToProps = dispatch => ({
//     onSetProjectTitle: title => dispatch(setProjectTitle(title))
// });

export default connect(
    mapStateToProps
    // mapDispatchToProps
)(injectIntl(FileListLib));
