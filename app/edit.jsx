import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import colors from './constants/colors';
import { getAllItems, updateItem } from './services/storageService';

const EditSchema = Yup.object().shape({
  title: Yup.string().required('Title required'),
  category: Yup.string().optional(),
});

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [task, setTask] = useState(null);

  useEffect(() => {
    async function load() {
      const all = await getAllItems();
      setTask(all.find((i) => i.id === id) || null);
    }
    load();
  }, [id]);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Task not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>

      <Formik
        initialValues={{
          title: task.title,
          category: task.category || '',
        }}
        validationSchema={EditSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const updated = { ...task, title: values.title, category: values.category };
          await updateItem(updated);
          router.replace('/tasks');
          setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isSubmitting }) => (
          <View>
            <MyTextInput
              label="Task Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
            />
            {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

            <MyTextInput
              label="Category"
              value={values.category}
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              style={{ marginTop: 12 }}
            />

            <MyButton
              text={isSubmitting ? 'Saving...' : 'Save Changes'}
              onPress={handleSubmit}
              loading={isSubmitting}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.darkBg, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.darkBg },
  notFound: { color: colors.text, fontSize: 20 },
  header: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 20 },
  error: { color: colors.danger, marginTop: 4 },
});
