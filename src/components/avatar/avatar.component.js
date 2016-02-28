import './avatar.local.style.scss';
import Avatar from './avatar.module';
import templateUrl from './avatar.ngtpl.html';
import AvatarCtrl from './avatar.ctrl';

export default Avatar.component('avatar', {
  bindings: {
    props: '='
  },
  controller: AvatarCtrl,
  templateUrl: templateUrl,
});
