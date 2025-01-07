import React from 'react';
import {
    Box,
    IconButton,
    Typography,
    Avatar,
    Dialog,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Button } from '@mui/material';

/**
 * A full-screen overlay for mobile to show all comments and allow new comments.
 */
const CommentsOverlay = ({
    open,
    onClose,
    video,
    user,
    comments = [],
    loadingComments,
    handleAddComment,
}) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // We only want this to appear on mobile. On desktop, we might ignore it,
    // but let's allow it to open if we wanted to (for demonstration).
    // We'll make it a full-screen Dialog on small screens.
    return (
        <Dialog
            open={open}
            onClose={(e) => {
                e.stopPropagation(); // Prevent bubbling to VideoPopup
                onClose(); // Close the CommentsOverlay
            }}
            fullScreen={!isDesktop}
            PaperProps={{
                sx: {
                    backgroundColor: '#000',
                    color: '#fff',
                    // For desktop, maybe limit the width
                    width: isDesktop ? 600 : '100%',
                    height: isDesktop ? '80vh' : '100%',
                },
            }}
        >
            {/* Top bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid #444',
                }}
            >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Comments
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Comments list */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {loadingComments ? (
                    <Typography variant="body2">Loading comments...</Typography>
                ) : comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                            <Avatar
                                src={comment.profile?.user?.image}
                                alt={comment.profile?.user?.name}
                                sx={{ width: 32, height: 32 }}
                            />
                            <Box>
                                <Typography variant="body2" fontWeight="bold">
                                    {comment.profile?.user?.name}
                                </Typography>
                                <Typography variant="body2">{comment.text}</Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">No comments yet.</Typography>
                )}
            </Box>

            {/* Add Comment Row */}
            <Box
                sx={{
                    borderTop: '1px solid #444',
                    p: 2,
                    display: 'flex',
                    gap: 1,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <CommentsOverlay.AddCommentInput onAddComment={handleAddComment} />
            </Box>
        </Dialog>
    );
};

/**
 * A reusable component for adding a comment (TextField + Button).
 * Used in both Desktop side panel and CommentsOverlay.
 */
CommentsOverlay.AddCommentInput = function AddCommentInput({ onAddComment }) {
    const [commentText, setCommentText] = React.useState('');

    const handlePost = () => {
        onAddComment(commentText);
        setCommentText('');
    };

    return (
        <>
            <TextField
                placeholder="Add a comment..."
                fullWidth
                size="small"
                variant="outlined"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                    backgroundColor: '#111',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                            borderColor: '#444',
                        },
                        '&:hover fieldset': {
                            borderColor: '#666',
                        },
                    },
                }}
            />
            <Button variant="contained" size="small" onClick={handlePost}>
                Post
            </Button>
        </>
    );
};

export default CommentsOverlay;
