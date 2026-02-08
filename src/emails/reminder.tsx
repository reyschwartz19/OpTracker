import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Section,
    Row,
    Column,
} from '@react-email/components'
import * as React from 'react'

interface ReminderEmailProps {
    opportunityTitle: string
    deadline: string
    opportunityLink: string
    daysLeft: number
}

export const ReminderEmail = ({
    opportunityTitle,
    deadline,
    opportunityLink,
    daysLeft,
}: ReminderEmailProps) => (
    <Html>
        <Head />
        <Preview>Reminder: {opportunityTitle} is due soon!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Don't miss out!</Heading>
                <Text style={text}>
                    The deadline for <strong>{opportunityTitle}</strong> is coming up in{' '}
                    {daysLeft} days.
                </Text>
                <Section style={details}>
                    <Row>
                        <Column>
                            <Text style={label}>Deadline</Text>
                            <Text style={value}>{deadline}</Text>
                        </Column>
                    </Row>
                </Section>
                <Link href={opportunityLink} style={button}>
                    View Opportunity
                </Link>
            </Container>
        </Body>
    </Html>
)

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
}

const h1 = {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.25',
    color: '#1a1a1a',
}

const text = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#4a4a4a',
}

const details = {
    backgroundColor: '#f4f4f4',
    padding: '16px',
    borderRadius: '4px',
    margin: '16px 0',
}

const label = {
    fontSize: '12px',
    color: '#666666',
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
}

const value = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0',
}

const button = {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '16px',
}

export default ReminderEmail
