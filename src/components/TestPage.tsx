import { Button, ButtonProps } from '@gaudiy/designed-components';
import { useFormikContext } from 'formik';

const FormButton = ({ disabled: disabledProps, ...props }: ButtonProps) => {
  const { isValid } = useFormikContext();

  const disabled = disabledProps || !isValid;

  return <Button type="submit" disabled={disabled} {...props} />;
};

export default FormButton;
