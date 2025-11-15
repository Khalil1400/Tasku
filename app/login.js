import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import colors from './constants/colors';
import { loginMock } from './services/authService';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(3, 'Too short').required('Password required'),
});

export default function LoginScreen() {
  const router = useRouter();
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <View style={{ flex: 1, backgroundColor: colors.darkBg }}>
      <KeyboardAvoidingView style={styles.avoidingView} behavior={behavior} keyboardVerticalOffset={60}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.sub}>Please sign in to continue</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                setSubmitting(true);
                await loginMock(values);
                router.replace('/tasks');
              } catch (err) {
                setErrors({ general: err?.message || 'Login failed. Please check your credentials.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={{ width: '100%' }}>
                <MyTextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {touched.email && errors.email && <Text style={styles.errorSmall}>{errors.email}</Text>}

                <MyTextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={styles.errorSmall}>{errors.password}</Text>}

                {errors.general && <Text style={styles.error}>{errors.general}</Text>}

                <MyButton
                  text={isSubmitting ? 'Signing in...' : 'Sign in'}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={{ marginTop: 16 }}
                />

                <Text
                  style={styles.guestHint}
                  onPress={() => router.push('/tasks')}
                >
                  Continue as guest
                </Text>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  avoidingView: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  heading: { color: colors.text, fontSize: 26, fontWeight: '700', textAlign: 'center' },
  sub: { color: colors.accent, textAlign: 'center', marginBottom: 18 },
  errorSmall: {
    color: colors.danger,
    marginTop: 2,
    marginBottom: 6,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
    marginTop: 8,
  },
  guestHint: { color: colors.accent, marginTop: 12, textAlign: 'center' },
});
