// app/login.jsx
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";
import MyButton from "./components/MyButton";
import MyTextInput from "./components/MyTextInput";
import ScreenContainer from "./components/ScreenContainer";
import colors from "./constants/colors";
import { useAuth } from "./contexts/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(3, "Too short").required("Password required"),
});

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <ScreenContainer>
      <View style={styles.inner}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Login to continue</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, actions) => {
            setLoading(true);
            try {
              await signIn(values.email, values.password);
              router.replace("/(tabs)/tasks");
            } catch (err) {
              actions.setFieldError("general", err.message || "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
         {({ handleSubmit, handleChange, values, errors, touched }) => (
            <>
              <MyTextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange("email")}
                label="Email"
              />
              {errors.email && touched.email ? <Text style={styles.errorSmall}>{errors.email}</Text> : null}

              <MyTextInput
                placeholder="Password"
                secureTextEntry
                 value={values.password}
                onChangeText={handleChange("password")}
                label="Password"
              />
              {errors.password && touched.password ? <Text style={styles.errorSmall}>{errors.password}</Text> : null}

              {errors.general ? <Text style={styles.error}>{errors.general}</Text> : null}

              <MyButton text="Login" onPress={handleSubmit} loading={loading} style={{ marginTop: 12 }} />
            </>
          )}
        </Formik>
        
        <Text style={styles.guestHint}>Use any email + password to simulate login (mocked)</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, justifyContent: "center", padding: 20 },
  heading: { fontSize: 28, fontWeight: "700", color: colors.textPrimary, marginBottom: 6 },
  sub: { color: colors.textSecondary, marginBottom: 18 },
  errorSmall: { color: colors.danger, marginTop: 6, fontSize: 12 },
  error: { color: colors.danger, marginTop: 8 },
  guestHint: { color: colors.accent, marginTop: 12, textAlign: "center" },
});