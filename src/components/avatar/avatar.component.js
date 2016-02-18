import Avatar from './avatar.module';
import template from './avatar.tpl.mst';
import style from './avatar.local.style.scss';
import AvatarCtrl from './avatar.ctrl';

export default Avatar.component('avatar', {
  bindings: {
    props: '='
  },
  controller: AvatarCtrl,
  template: template({style}),
});
