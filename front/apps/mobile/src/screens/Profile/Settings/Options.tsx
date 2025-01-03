import { Box, BoxHeader, Switch } from '@ledget/native-ui';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { selectSettings, updateSetting } from '@/features/uiSlice';

const Options = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  return (
    <>
      <BoxHeader>Options</BoxHeader>
      <Box variant="nestedContainer">
        <Switch
          label="Open on home screen"
          value={settings?.startOnHome}
          onValueChange={(value) => {
            dispatch(updateSetting({ key: 'startOnHome', value }));
          }}
        />
      </Box>
    </>
  );
};
export default Options;
