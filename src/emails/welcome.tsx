import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
    name: string
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Opportunity Manager!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome, {name}!</Heading>
                <Text style={text}>
                    We're excited to have you on board. Opportunity Manager helps you track
                    scholarships, internships, and jobs so you never miss a deadline.
                </Text>
                <Text style={text}>
                    Start by adding your first opportunity or exploring our curated list.
                </Text>
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={button}>
                    Go to Dashboard
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

const button = {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '16px',
}

export default WelcomeEmail
