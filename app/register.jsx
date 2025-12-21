import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { MyButton, MyTextInput, ScreenContainer } from "./ui";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View style={styles.hero}>
              <Text style={styles.heading}>Create account</Text>
              <Text style={styles.sub}>Sign up to sync your tasks securely.</Text>
            </View>

            <View style={styles.formCard}>
              <Formik
                initialValues={{ email: "", password: "", confirm: "" }}
                validationSchema={RegisterSchema}
                onSubmit={async (values, actions) => {
                  setLoading(true);
                  actions.setFieldError("general", "");
                  try {
                    await signUp(values.email, values.password);
                    router.replace("/(tabs)/tasks");
                  } catch (err) {
                    actions.setFieldError("general", err?.message || "Sign up failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {({ handleSubmit, handleChange, values, errors, touched, setFieldTouched }) => (
                  <>
                    <View style={{ marginBottom: 12 }}>
                      <MyTextInput
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={() => setFieldTouched("email", true)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        placeholder="you@example.com"
                      />
                      {touched.email && errors.email ? <Text style={styles.errorSmall}>{errors.email}</Text> : null}
                    </View>

                    <View style={{ marginBottom: 12 }}>
                      <MyTextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={() => setFieldTouched("password", true)}
                        secureTextEntry
                        placeholder="********"
                        textContentType="password"
                        autoComplete="password"
                      />
                      {touched.password && errors.password ? <Text style={styles.errorSmall}>{errors.password}</Text> : null}
                    </View>

                    <View style={{ marginBottom: 6 }}>
                      <MyTextInput
                        label="Confirm password"
                        value={values.confirm}
                        onChangeText={handleChange("confirm")}
                        onBlur={() => setFieldTouched("confirm", true)}
                        secureTextEntry
                        placeholder="********"
                        textContentType="password"
                        autoComplete="password"
                      />
                      {touched.confirm && errors.confirm ? <Text style={styles.errorSmall}>{errors.confirm}</Text> : null}
                    </View>

                    {errors.general ? <Text style={styles.error}>{errors.general}</Text> : null}

                    <View style={{ marginTop: 14 }}>
                      <MyButton text="Sign up" onPress={handleSubmit} loading={loading} />
                    </View>

                    <View style={styles.row}>
                      <TouchableOpacity onPress={() => router.replace("/login")} disabled={loading}>
                        <Text style={styles.link}>Already have an account? Log in</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    keyboard: { flex: 1 },
    scrollContainer: { flexGrow: 1 },
    inner: { flex: 1, justifyContent: "flex-start", padding: 20, minHeight: 520, gap: 14, paddingTop: 40 },
    hero: { alignItems: "center", gap: 4 },
    heading: { fontSize: 28, fontWeight: "800", color: colors.text },
    sub: { color: colors.textSecondary, marginBottom: 6 },
    formCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    errorSmall: { color: colors.danger, marginTop: 6, fontSize: 12 },
    error: { color: colors.danger, marginTop: 8 },
    row: { marginTop: 12, flexDirection: "row", justifyContent: "center", alignItems: "center" },
    link: { color: colors.accent, textDecorationLine: "underline" },
  });
