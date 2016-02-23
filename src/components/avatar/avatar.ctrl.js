import defaultAvatar from './images/avatar.png';

class AvatarCtrl {
  constructor($scope) {
    'ngInject';
  }

  setActive() {
    // @TODO how to change prop.isActive;
  }

  avatarClassList() {
    return {
      'is_active': false
    }
  }

  avatarBodyStyle(props) {
    let {src} = props || this.props || {};

    if (!src) {
      src = defaultAvatar;
    }

    return {
      color: 'blue',
      backgroundImage: `url(${src})`
    };
  }
}

export default AvatarCtrl;
