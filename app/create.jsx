import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import * as Yup from "yup";
import { MyButton, MyTextInput, ScreenContainer } from "./ui";
import { useTheme } from "./contexts/ThemeContext";
import { addItem } from "./services/storageService";

const ItemSchema = Yup.object().shape({
  title: Yup.string().required("Title required"),
  category: Yup.string(),
});

export default function CreateScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  async function pickImage(setFieldValue) {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return alert("Permission denied");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!res.canceled && res.assets && res.assets[0]) {
      setFieldValue("image", res.assets[0].uri);
    }
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: "Create Task" }} />
      <Formik
        initialValues={{ title: "", category: "", notes: "", image: null }}
        validationSchema={ItemSchema}
        onSubmit={async (v, { setSubmitting, resetForm }) => {
          try {
            await addItem(v);
            resetForm();
            router.replace("/tasks");
          } catch (e) {
            console.log("Add item failed", e);
            alert(e?.message || "Failed to save task. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched, setFieldValue, isSubmitting }) => (
          <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
            <MyTextInput label="Title" placeholder="Task title" value={values.title} onChangeText={handleChange("title")} />
            {errors.title && touched.title ? <Text style={[styles.error, { color: colors.danger }]}>{errors.title}</Text> : null}

            <MyTextInput label="Category" placeholder="Category" value={values.category} onChangeText={handleChange("category")} />

            <MyTextInput label="Notes" placeholder="Notes" value={values.notes} onChangeText={handleChange("notes")} multiline numberOfLines={4} />

            {values.image ? <Image source={{ uri: values.image }} style={styles.image} /> : null}

            <MyButton text="Pick Image" onPress={() => pickImage(setFieldValue)} />
            <MyButton text={isSubmitting ? "Saving..." : "Save"} onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 8 }} />
          </ScrollView>
        )}
      </Formik>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: { padding: 12 },
  error: { color: "red", marginBottom: 10, marginTop: -6 },
  image: { height: 150, width: "100%", borderRadius: 8, marginVertical: 8, backgroundColor: "#eee" },
});
