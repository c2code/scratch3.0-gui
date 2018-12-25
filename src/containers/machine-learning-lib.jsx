import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

// import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';
import png1 from './5.1.png';
// import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    }
});

class MachineLearningLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
    }
    handleItemSelect (item) {
        console.log(item.name);
        // const id = item.extensionId;
        // let url = item.extensionURL ? item.extensionURL : id;
        // if (!item.disabled && !id) {
        //     // eslint-disable-next-line no-alert
        //     url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
        // }
        // if (id && !item.disabled) {
        //     if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
        //         this.props.onCategorySelected(id);
        //     } else {
        //         this.props.vm.extensionManager.loadExtensionURL(url).then(() => {
        //             this.props.onCategorySelected(id);
        //         });
        //     }
        // }
        // let gaLabel = '';
        // if (typeof (item.name) === 'string') {
        //     gaLabel = item.name;
        // } else {
        //     // Name is localized, get the default message for the gaLabel
        //     gaLabel = item.name.props.defaultMessage;
        // }
        // analytics.event({
        //     category: 'library',
        //     action: 'Select Extension',
        //     label: gaLabel
        // });
    }
    render () {
        const data = [
            {
                name: 'test',
                iconURL: png1
            }
        ];
        const extensionLibraryThumbnailData = data.map(extension => ({
            rawURL: extension.iconURL || extensionIcon,
            ...extension
        }));
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={false}
                id="machinelearningLibrary"
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

MachineLearningLibrary.propTypes = {
    intl: intlShape.isRequired,
    // onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(MachineLearningLibrary);
