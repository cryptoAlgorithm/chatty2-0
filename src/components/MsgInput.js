import { IconButton, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography } from '@material-ui/core';
import AttachmentRoundedIcon from '@material-ui/icons/AttachmentRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import CameraAltRoundedIcon from '@material-ui/icons/CameraAltRounded';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import { useRef } from 'react';

export default function MsgInput(props) {
    const { disableState, send } = props;

    const fInputRef = useRef();

    const attachmentActions = [
        { icon: <ImageRoundedIcon />, name: 'Photos & Videos', onClick: () => {
            console.log('photos and videos');
            fInputRef.current.click();
        }},
        { icon: <CameraAltRoundedIcon />, name: 'Camera', onClick: () => {} },
        { icon: <InsertDriveFileRoundedIcon />, name: 'Document', onClick: () => {} },
    ];

    return <>
        { disableState.disabled &&
            <Paper variant='outlined'
                sx={{width: 'calc(100% - 1rem)', mb: 1, mx: 1, height: 'calc(56px - .5rem)', display: 'flex', p: 1, alignItems: 'center'}}>
                {disableState.icon}
                <Typography ml={1}>{disableState.label}</Typography>
            </Paper>
        }
        { (!disableState.disabled || !disableState) &&
            <div style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
                <input type='file' ref={fInputRef} style={{display: 'none'}}
                       onChange={e => {
                           console.log('File picked:', e.currentTarget.files[0]);
                           const file = e.currentTarget.files[0]
                           e.currentTarget.value = '';
                           if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                               const reader = new FileReader();

                               reader.onload = e => {
                                   send('img', e.target.result);
                                   console.log(e.target.result);
                               };

                               reader.readAsDataURL(file);
                           }
                       }} />
                <SpeedDial
                    sx={
                        {'&>button': {width: '46px', height: '46px'},
                            position: 'absolute', bottom: 6, left: 1}}
                    ariaLabel='Add an attachment'
                    icon={<SpeedDialIcon icon={<AttachmentRoundedIcon />} />}>
                    {attachmentActions.map((action) => (
                        <SpeedDialAction
                            onClick={action.onClick}
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                        />
                    ))}
                </SpeedDial>

                <TextField variant='filled' multiline label={`Say something awesome in ${props.n}`} maxRows={5}
                           onChange={event => props.sm(event.target.value)}
                           value={props.m}
                           onKeyPress={e => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                   props.send();
                                   e.preventDefault();
                               }
                           }}
                           inputProps={
                               {maxLength: 1000}
                           }
                           sx={{flexGrow: 1, mr: .5, ml: '58px', '& textarea.MuiInputBase-input':
                                   {fontFamily: '"Source Sans Pro", system-ui, sans-serif', fontSize: 18}}} />

                <IconButton color='primary' aria-label='send' sx={{mr: .5, mb: .5}} onClick={props.send}>
                    <SendRoundedIcon />
                </IconButton>
            </div>
        }
        </>
}