import Avatar from './avatar.module';
import templateUrl from './avatar.ngtpl.html';
import style from './avatar.local.style.scss';
import AvatarCtrl from './avatar.ctrl';

export default Avatar.component('avatar', {
  bindings: {
    props: '='
  },
  controller: AvatarCtrl,
  templateUrl: templateUrl,
});
