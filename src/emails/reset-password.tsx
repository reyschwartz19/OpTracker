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

interface ResetPasswordEmailProps {
    resetLink: string
}

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => (
    <Html>
        <Head />
        <Preview>Reset your password</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Reset your password</Heading>
                <Text style={text}>
                    We received a request to reset your password. If you didn't make this
                    request, you can ignore this email.
                </Text>
                <Link href={resetLink} style={button}>
                    Reset Password
                </Link>
                <Text style={text}>
                    Or copy and paste this link into your browser:
                    <br />
                    <Link href={resetLink} style={link}>
                        {resetLink}
                    </Link>
                </Text>
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
    marginBottom: '16px',
}

const link = {
    color: '#067df7',
    textDecoration: 'none',
}

export default ResetPasswordEmail
