import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from "@mantine/core";
import { MoonStars, Sun, Trash } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  useHotkeys([["mod+J", toggleColorScheme]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");

  const createTask = () => {
    const newTask = {
      title: taskTitle.current.value,
      summary:
        taskSummary.current.value || "No summary was provided for this task",
    };
    setTasks([...tasks, newTask]);
    saveTasks([...tasks, newTask]);
    setOpened(false);
  };

  const deleteTask = (index) => {
    const clonedTasks = [...tasks];
    clonedTasks.splice(index, 1);
    setTasks(clonedTasks);
    saveTasks(clonedTasks);
  };

  const loadTasks = () => {
    const loadedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(loadedTasks);
  };

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS>
        <div className="App">
          <Modal
            opened={opened}
            size="md"
            title="New Task"
            withCloseButton={false}
            onClose={() => setOpened(false)}
            centered>
            <TextInput
              mt="md"
              ref={taskTitle}
              placeholder="Task Title"
              required
              label="Title"
            />
            <TextInput
              ref={taskSummary}
              mt="md"
              placeholder="Task Summary"
              label="Summary"
            />
            <Group mt="md" position="apart">
              <Button onClick={() => setOpened(false)} variant="subtle">
                Cancel
              </Button>
              <Button onClick={createTask}>Create Task</Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position="apart">
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}>
                My Tasks
              </Title>
              <ActionIcon color="blue" onClick={toggleColorScheme} size="lg">
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Card withBorder key={index} mt="sm">
                  <Group position="apart">
                    <Text weight="bold">{task.title}</Text>
                    <ActionIcon
                      onClick={() => deleteTask(index)}
                      color="red"
                      variant="transparent">
                      <Trash />
                    </ActionIcon>
                  </Group>
                  <Text color="dimmed" size="md" mt="sm">
                    {task.summary}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size="lg" mt="md" color="dimmed">
                You have no tasks
              </Text>
            )}
            <Button onClick={() => setOpened(true)} fullWidth mt="md">
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
