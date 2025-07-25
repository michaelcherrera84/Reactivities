import { useParams } from 'react-router';
import { useProfile } from '../../lib/hooks/useProfile';
import { editProfileSchema, type EditProfileSchema } from '../../lib/schemas/editProfileSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import TextInput from '../../app/shared/components/TextInput';

type Props = {
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEdit({ setEditMode }: Props) {

    const { id } = useParams();
    const { updateProfile, profile } = useProfile(id);
    const { control, handleSubmit, reset, formState: { isDirty, isValid } } = useForm<EditProfileSchema>({
        resolver: zodResolver(editProfileSchema),
        mode: 'onTouched',
    });

    const onSubmit = (data: EditProfileSchema) => {
        updateProfile.mutate(data, {
            onSuccess: () => setEditMode(false),
        });
    };

    useEffect(() => {
        reset({
            displayName: profile?.displayName,
            bio: profile?.bio || '',
        });
    }, [profile, reset]);

    return (
        <Box component="form"
             onSubmit={handleSubmit(onSubmit)}
             display="flex"
             flexDirection="column"
             alignContent="center"
             gap={3}
             mt={3}
        >
            <TextInput name="displayName" label="Display Name" control={control} />
            <TextInput name="bio" label="Add your bio" control={control} multiline rows={4} />
            <Button type="submit" variant="contained" disabled={!isValid || !isDirty || updateProfile.isPending}>
                Update profile
            </Button>
        </Box>
    );
}