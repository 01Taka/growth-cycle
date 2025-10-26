import React from 'react';
import { Button, Card, CardSection, Flex, Group, Pill, Stack, Text } from '@mantine/core';
import { ReviewLearningCycleList } from './ReviewLearningCycleList';

interface HomeReviewCardProps {}

export const HomeReviewCard: React.FC<HomeReviewCardProps> = ({}) => {
  // Styles for the main card and header elements to match the image
  const cardBgColor = '#fdf8ee'; // Light beige/tan for the main card
  const orangeButtonColor = '#f8b449'; // The specific orange tone for the buttons

  return (
    <Card
      shadow="sm" // Add a subtle shadow to lift the card
      padding="md"
      radius="lg" // Large border radius for the whole card
      bg={cardBgColor}
      style={{ margin: '10px' }} // Add some margin around the card
    >
      <CardSection withBorder={false} p="md">
        <Stack>
          {/* Header Section: 今日の復習 and 残り 5 タスク */}
          <Flex justify="space-between" align="center">
            <Text
              size="xl"
              fw={700} // Bold font weight
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {/* Optional: Add a small book icon next to the text */}
              <span style={{ marginRight: 8 }}>📚</span>
              今日の復習
            </Text>
            <Pill
              size="lg"
              radius="xl"
              bg="#8c775d" // Darker brown/grey background for the pill
              c="white" // White text color
              style={{ fontWeight: 700 }}
            >
              残り 5 タスク
            </Pill>
          </Flex>

          {/* Review Buttons Section: 昨日の復習 and 1週間前の復習 */}
          <Flex justify="space-around" gap="md">
            {/* Button for '昨日の復習' */}
            <Button
              variant="filled"
              color={orangeButtonColor}
              radius="md" // Rounded corners
              size="lg"
              fullWidth={true} // Ensure buttons take up equal space
              style={{
                height: 'auto',
                padding: '10px 15px',
                whiteSpace: 'normal',
                lineHeight: 1.2,
              }}
            >
              昨日の復習 1/3
            </Button>

            {/* Button for '1週間前の復習' */}
            <Button
              variant="filled"
              color={orangeButtonColor}
              radius="md"
              size="lg"
              fullWidth={true}
              style={{
                height: 'auto',
                padding: '10px 15px',
                whiteSpace: 'normal',
                lineHeight: 1.2,
              }}
            >
              先週の復習 0/3
            </Button>
          </Flex>

          {/* Subject Review List: Handled by ReviewLearningCycleList */}
          {/* Note: The styling of the subject rows (trees/colors) must be inside ReviewLearningCycleList itself. */}
          <ReviewLearningCycleList />
        </Stack>
      </CardSection>
    </Card>
  );
};

// Assuming ReviewLearningCycleList is defined elsewhere and produces the subject list structure.
// You would need to ensure ReviewLearningCycleList uses appropriate Mantine components (like Card or Paper)
// to create the distinct colored rows with icons, text, and scores.
