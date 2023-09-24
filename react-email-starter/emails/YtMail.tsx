import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";
import { Tailwind } from "@react-email/tailwind";

interface YtEmailProps {
  firstName?: string;
  title?: string;
  summary?: string;
  bannerLink?: string;
  ytLink?: string;
  channelTitle?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://localhost:3000";

const YelpRecentLoginEmail = ({
  bannerLink = "https://i.ytimg.com/vi/oKzVBgHqsis/maxresdefault.jpg",
  firstName = "ani",
  summary = "This is a summary",
  title = "Code That MURDERED 6 People | Prime Reacts",
  ytLink = "https://www.youtube.com/watch?v=oKzVBgHqsis",
  channelTitle = "Prime Reacts",
}: YtEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Yelp recent login</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container>
            <Text className="flex justify-center text-2xl text-purple-600 p-5 font-bold">
              {title}
            </Text>
            <Section>
              <Img width={620} src={bannerLink} />

              <Row>
                <Column>
                  <Heading
                    style={{
                      fontSize: 32,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Hi {firstName},
                  </Heading>
                  <Heading
                    as="h2"
                    style={{
                      fontSize: 26,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    On today's episode of {channelTitle} ...
                  </Heading>

                  <Text>{summary}</Text>
                </Column>
              </Row>
              <Row>
                <Column colSpan={2}>
                  <Text>
                    Watch the full video
                    <Link href={ytLink}> here.</Link>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default YelpRecentLoginEmail;
