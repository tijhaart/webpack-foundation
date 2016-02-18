class AvatarCtrl {
  constructor($scope) {
    'ngInject';
  }

  avatarBodyStyle(props) {
    const {src} = props || this.props;

    return {
      backgroundImage: src ? `url(${src})` : ''
    };
  }
}

export default AvatarCtrl;
