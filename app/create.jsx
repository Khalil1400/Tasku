// app/create.jsx
import { useRouter } from "expo-router";
import { Formik } from "formik";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup"; // lowercase — correct
import { addItem } from "./services/storageService";

const CreateSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim(),
});

export default function CreateTask() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>Create New Task</Text>

        <Formik
          initialValues={{ title: "", description: "" }}
          validationSchema={CreateSchema}
          onSubmit={async (values, { resetForm }) => {
            await addItem({
              id: Date.now().toString(),
              title: values.title.trim(),
              description: values.description?.trim() || "",
              createdAt: Date.now(),
              isFavorite: false,
              isComplete: false,
            });
            resetForm();
            router.push("/tasks");
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.title && errors.title ? styles.inputError : null,
                  ]}
                  placeholder="Task title..."
                  placeholderTextColor="#999"
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                />
                {touched.title && errors.title && (
                  <Text style={styles.error}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Add more details..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save Task</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 25,
    marginTop: 10,
    color: "#1A1A1A",
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textarea: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  error: {
    color: "#FF6B6B",
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#4C6EF5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#4C6EF5",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
