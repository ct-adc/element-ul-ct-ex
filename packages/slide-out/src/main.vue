<template>
  <div class="el-slide-out">
    <transition
    name="slideout-fade">
      <div class="el-slide-out__mask"
        @click="handleWrapperClick"
        v-show="visible"></div>
    </transition>
    <transition name="slide"
                @after-enter="afterEnter"
                @after-leave="afterLeave">
      <div class="el-slide-out__main"
            :class="customClass"
            v-show="visible"
           :style="{'width': width}">
        <div class="el-slide-out__header clearfix">
          <slot name="title">
                <span class="el-slide-out__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-slide-out__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-slide-out__body">
          <slot name="body"></slot>
        </div>
        <div class="el-slide-out__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Popup from 'element-ui-ct/lib/utils/popup';
import Migrating from 'element-ui-ct/lib/mixins/migrating';
import emitter from 'element-ui-ct/lib/mixins/emitter';

export default {
  name: 'ElSlideOut',

  mixins: [Popup, emitter, Migrating],

  props: {
    width: {
      type: String,
      default: '80%'
    },
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },
    beforeClose: Function,
    lockScroll: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      closed: false
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
      }
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
    }
  }
};
</script>