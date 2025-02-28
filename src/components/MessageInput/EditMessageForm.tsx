import React, { useEffect } from 'react';
import { FileUploadButton, ImageDropzone } from 'react-file-utils';

import { EmojiPicker } from './EmojiPicker';
import {
  EmojiIconSmall as DefaultEmojiIcon,
  FileUploadIcon as DefaultFileUploadIcon,
} from './icons';
import { UploadsPreview } from './UploadsPreview';

import { ChatAutoComplete } from '../ChatAutoComplete/ChatAutoComplete';
import { Tooltip } from '../Tooltip/Tooltip';

import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useTranslationContext } from '../../context/TranslationContext';
import { useMessageInputContext } from '../../context/MessageInputContext';
import { useComponentContext } from '../../context/ComponentContext';

import type { CustomTrigger, DefaultStreamChatGenerics } from '../../types/types';

export const EditMessageForm = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
>() => {
  const { acceptedFiles, multipleUploads } = useChannelStateContext<StreamChatGenerics>(
    'EditMessageForm',
  );
  const { t } = useTranslationContext('EditMessageForm');

  const {
    clearEditingState,
    closeEmojiPicker,
    emojiPickerIsOpen,
    handleSubmit,
    isUploadEnabled,
    maxFilesLeft,
    openEmojiPicker,
    uploadNewFiles,
  } = useMessageInputContext<StreamChatGenerics, V>('EditMessageForm');

  const {
    EmojiIcon = DefaultEmojiIcon,
    FileUploadIcon = DefaultFileUploadIcon,
  } = useComponentContext<StreamChatGenerics>('EditMessageForm');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && clearEditingState) clearEditingState();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clearEditingState]);

  return (
    <div className='str-chat__edit-message-form'>
      <ImageDropzone
        accept={acceptedFiles}
        disabled={!isUploadEnabled || maxFilesLeft === 0}
        handleFiles={uploadNewFiles}
        maxNumberOfFiles={maxFilesLeft}
        multiple={multipleUploads}
      >
        <form onSubmit={handleSubmit}>
          {isUploadEnabled && <UploadsPreview />}
          <EmojiPicker small />
          <ChatAutoComplete />
          <div className='str-chat__message-team-form-footer'>
            <div className='str-chat__edit-message-form-options'>
              <button
                aria-label='Open Emoji Picker'
                className='str-chat__input-emojiselect'
                onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker}
              >
                <EmojiIcon />
              </button>
              {isUploadEnabled && (
                <div className='str-chat__fileupload-wrapper' data-testid='fileinput'>
                  <Tooltip>
                    {maxFilesLeft
                      ? t<string>('Attach files')
                      : t<string>("You've reached the maximum number of files")}
                  </Tooltip>
                  <FileUploadButton
                    accepts={acceptedFiles}
                    disabled={maxFilesLeft === 0}
                    handleFiles={uploadNewFiles}
                    multiple={multipleUploads}
                  >
                    <span className='str-chat__input-fileupload'>
                      <FileUploadIcon />
                    </span>
                  </FileUploadButton>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => {
                  if (clearEditingState) {
                    clearEditingState();
                  }
                }}
              >
                {t<string>('Cancel')}
              </button>
              <button type='submit'>{t<string>('Send')}</button>
            </div>
          </div>
        </form>
      </ImageDropzone>
    </div>
  );
};
