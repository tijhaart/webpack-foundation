import defaultAvatar from './images/avatar.png';

class AvatarCtrl {
  constructor() {
    'ngInject';
  }

  setActive() {
    // @TODO how to change prop.isActive;
  }

  avatarClassList() {
    // Y U NO want ESLint?
    // jshint ignore:start
    // jscs:disable
    return {
      is_active: false
    };
    // jscs:enable
    // jshint ignore:end
  }

  avatarBodyStyle(props) {
    let { src } = props || this.props || {};

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
